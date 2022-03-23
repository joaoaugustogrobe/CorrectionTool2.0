const axios = require('axios');
require('dotenv').config()

// import vueStore from '../src/store/index';

// import qs from 'querystring';


class Corretor {
  constructor() {
    this.version = 'v1';
    this.url = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`;
    this.token = '';

    // base axios config
    this.config = {
      validateStatus: false,
      withCredentials: true,
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   }
    };

    // this.store = vueStore;

    // this.fullUrl = `${this.url}/${this.version}`;
    this.fullUrl = this.url;

    this.shouldResync = false;
    this.pingInterval = null;
    this.pingTimeout = null;

  }

  setToken(token){
    this.token = token;
  }

  // post info to remote server
  async post(endpoint, data, token, params = {}) {

    // authenticate request
    this.authenticate(token);

    try {

      // validate fields
      //   const isValid = (schemas[endpoint]) ? this.validator.validate(data, schemas[endpoint]) : true;
      const isValid = true;

      if(isValid === true) {

        // toggle loader for endpoint
        // vueStore.commit('loading/set', { endpoint: endpoint, status: true }, { root: true });

        // clone config, so we don't change the global object
        // const config = _.cloneDeep(this.config);
        const config = this.config;

        // request to external api
        console.log("posting to", `${this.fullUrl}/${endpoint}`);
        const response = await axios.post(`${this.fullUrl}/${endpoint}`, data, { ...config, params: params, withCredentials: true });

        if(response.data && response.data.meta && !response.data.meta.ok) {
          return {
            meta: response.data.meta,
            ok: String(response.status).charAt(0) == '2',
            unauthorized: (response.status === 401),
            error: (response.data.meta.error) ? response.data.meta.error : false
          }

        }

        if(typeof response.data !== 'object' && response.status !== 204) {
          throw new Error('Serviço offline');
        }

        return {
          ...response.data.meta,
          ok: String(response.status).charAt(0) == '2',
          message: (response.data && response.data.meta) ? response.data.meta.message : null,
          data: response.data
        }

      } else {

        return {
          ok: false,
          error: this.mapErrors(isValid)
        }

      }

    } catch (e) {

      return {
        ok: false,
        unauthorized: e.message === 'Unauthorized',
        error: e.message
      }

    } finally {
      // vueStore.commit('loading/set', { endpoint: endpoint, status: false }, { root: true }); // stop loading state
    }

  }

  // post info to remote server
  async postMultipart(endpoint, data, params = {}) {

    // authenticate request
    this.authenticate();

    try {

      // validate fields
    //   const isValid = (schemas[endpoint]) ? this.validator.validate(data, schemas[endpoint]) : true;
        const isValid = true;

      if(isValid === true) {

        // toggle loader for endpoint
        // vueStore.commit('loading/set', { endpoint: endpoint, status: true }, { root: true });

        // parse multipart
        let formData = new FormData();

        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        })

        const source = axios.CancelToken.source();

        // request to external api
        const response = await axios.post(
          `${this.fullUrl}/${endpoint}`,
          formData,
          {
            ...params,
            cancelToken: source.token,
            onUploadProgress: (e) => {
              if (params.onUploadProgress) params.onUploadProgress(e, source);
            },
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (!response.data.meta.ok) {
          throw new Error(response.data.meta.error);
        }

        return {
          ok: true,
          data: response.data
        }

      } else {

        return {
          ok: false,
          error: this.mapErrors(isValid)
        }

      }

    } catch (e) {

      return {
        ok: false,
        error: e.message
      }

    } finally {
      // vueStore.commit('loading/set', { endpoint: endpoint, status: false }, { root: true }); // stop loading state
    }

  }

  // get info from remote server
  async get(endpoint, data, token) {

    // authenticate request
    this.authenticate((typeof token === 'string') ? token : null);

    try {

      // validate fields
      const isValid = true;

      if(isValid === true) {

        // toggle loader for endpoint
        // vueStore.commit('loading/set', { endpoint: endpoint, status: true }, { root: true });

        // request to external api
        console.log('get:', `${this.fullUrl}/${endpoint}`, this.config);
        const response = await axios.get(`${this.fullUrl}/${endpoint}`, { params: data, headers: this.config.headers }, this.config);

        return {
          ok: true,
          ...response.data,
          data: response.data.data
        }

      } else {

        return {
          ok: false,
          error: this.mapErrors(isValid)
        }

      }

    } catch (e) {

      const meta = (e.response && e.response.data) ? e.response.data.meta : null;

      return {
        ok: false,
        unauthorized: e.message === 'Unauthorized',
        too_many_requests: (e.response && e.response.status === 429),
        retryafter: (e.response && e.response.headers && e.response.headers.retryafter) ? parseInt(e.response.headers.retryafter) : 0,
        error: (meta && meta.error) ? meta.error : e.message
      }

    } finally {
      // vueStore.commit('loading/set', { endpoint: endpoint, status: false }, { root: true }); // stop loading state
    }

  }

  // get plain
  async getPlain(endpoint, data, options, token) {

    // authenticate request
    //this.authenticate((typeof token === "string") ? token : null);
    this.authenticate(token);

    try {

      // validate fields
    //   const isValid = (schemas[endpoint]) ? this.validator.validate(data, schemas[endpoint]) : true;
        const isValid = true;

      if(isValid === true) {

        // toggle loader for endpoint
        // vueStore.commit('loading/set', { endpoint: endpoint, status: true }, { root: true });

        // request to external api
        console.log('getPlain', `${this.fullUrl}/${endpoint}`, this.config);
        const response = await axios.get(`${this.fullUrl}/${endpoint}`, { params: data, ...options }, this.config);

        return {
          ok: true,
          data: response.data
        }

      } else {

        return {
          ok: false,
          error: this.mapErrors(isValid)
        }

      }

    } catch (e) {

      return {
        ok: false,
        error: e.message
      }

    } finally {
      // vueStore.commit('loading/set', { endpoint: endpoint, status: false }, { root: true }); // stop loading state
    }

  }

  async getBlob(endpoint, params = {}, onDownloadProgress = null) {
    try{
      const source = axios.CancelToken.source();

      this.authenticate(false); //The token is sent in the query string, it will remove from header

      // request to external api
      const response = await axios.request({
        method: 'GET',
        url: `${this.fullUrl}/${endpoint}`,
        responseType: 'blob',
        params,
        onDownloadProgress: (e) => {
          if (onDownloadProgress) onDownloadProgress(e, source);
        },
        cancelToken: source.token,
        ...this.config,
      });

      // if it's a blob
      if (response.status === 200) {
        return {
          ok: true,
          data: response.data,
          headers: response.headers,
          status: response.status,
        };
      }
      else {
        // converts blob to text
        try{
        //   const responseText = await readTextFromBlobAsync(response.data);
          const responseText = response.data; //TODO
          const responseData = JSON.stringify(responseText);
          return {
            ok: false,
            error: responseData.meta.error
          }
        }catch(e){
          return {
            ok: false,
            error: response.statusText
          }
        }
      }
    }catch(e){
      return {
        ok: false,
        error: e.message
      }
    }

  }

  parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  authenticate(token) {

    if(token === false) {
      delete axios.defaults.headers.common['Authorization'];
      return;
    }

    let jwt = (token) ? token : this.token;

    if(jwt) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    }

  }

  clear() {
    delete axios.defaults.headers.common['Authorization'];
  }

  // map validation errors
  mapErrors(errors) {
    let response = {};
    errors.forEach((error) => {
      const { actual, expected, field, message } = error;
      response[error.field] = {
        message,
        meta: {
          actual, expected, field
        }
      };
    })
    return response;
  }

}

// export default Corretor;
module.exports = Corretor
