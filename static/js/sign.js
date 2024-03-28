import { handleSignIn } from "./tools.js"

const showPassword = document.getElementById('showpwd')

showPassword.addEventListener('click', async() => {
    let pwd = document.getElementById('pwd')
    if (pwd.type === 'password') {
        pwd.type = 'text'
    }else{
        pwd.type = 'password'
    }
})

const submit = document.getElementById('sub')
submit.addEventListener('click', async (event) => {
    await handleSignIn(event)
})