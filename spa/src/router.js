import Vue from 'vue'
import Router from 'vue-router'
import Materias from './components/paginas/professor/Materias'
import Exercicios from './components/paginas/professor/Exercicios'
import Exercicio from './components/paginas/professor/Exercicio'
import Correcao from './components/paginas/professor/Correcao'
import Login from './components/paginas/Login'
import AlunoMaterias from './components/paginas/aluno/Materias'
import AlunoMatricula from './components/paginas/aluno/Matricula'
import AlunoMateria from './components/paginas/aluno/Materia'
import Register from './components/paginas/Register'
import ForgotPassword from './components/paginas/ForgotPassword'
import ResetPassword from './components/paginas/ResetPassword'
Vue.use(Router)

let router = new Router({

  routes: [
    {
      path: '/forgot_password',
      name: 'Forgot password',
      component: ForgotPassword,
    },
    {
      path: '/reset_password',
      name: 'Reset Password',
      component: ResetPassword,
      props: (route) => ({ token: route.query.token, id: route.query.id }),
    },
    {
      path: '/materias',
      name: 'materias',
      component: Materias,
      meta: { requiresAuth: true, role: "professor" }
    },
    {
      path: '/exercicios',
      name: 'exercicios',
      component: Exercicios,
      meta: { requiresAuth: true, role: "professor" }
    },
    {
      path: '/exercicio/:id',
      name: 'exercicio',
      component: Exercicio,
      meta: { requiresAuth: true, role: "professor" }
    },
    {
      path: '/correcao/:id',
      name: 'correcao',
      component: Correcao,
      meta: { requiresAuth: true, role: "professor" }
    },
    {
      path: '/aluno/materias',
      name: 'alunoMaterias',
      component: AlunoMaterias,
      meta: { requiresAuth: true, role: "aluno" }
    },
    {
      path: '/aluno/matricula',
      name: 'alunoMatricula',
      component: AlunoMatricula,
      meta: { requiresAuth: true, role: "aluno" }
    },
    {
      path: '/aluno/materia/:id',
      name: 'alunoMateria',
      component: AlunoMateria,
      meta: { requiresAuth: true, role: "aluno" }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requerAuth = to.matched.some(record  => record.meta.requiresAuth)
  const requerProfessor = to.matched.some(record => record.meta.role == "professor")
  const requerAluno = to.matched.some(record => record.meta.role == "aluno")
  const user = JSON.parse(localStorage.getItem("user"))


  if (requerAuth) {
    if(!user)
      next('/login')
    else{//Esta logado
      if(requerProfessor){//Rota prof
        if(user.role == "professor")
          next()
        else
          next('/aluno/materias')
      }else if(requerAluno){ //Rota aluno
        if(user.role == "aluno")
          next()
        else
          next('/exercicios')
      }
    }
  }else{
    if(!user)
      next()
    else{
      if(user.role == "professor")
        next("/exercicios")
      else
        next("/aluno/materias")
    }
  }
})

export default router;