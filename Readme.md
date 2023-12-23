# monguex

Biblioteca monguex utilitário das funções do mongoose<br>
NPM - https://www.npmjs.com/package/monguex
## Instalação

Para instalar a biblioteca, utilize o seguinte comando:

```bash
npm install monguex
```
ou

```bash
yarn  add monguex
```
<h1>Uso</h1>
<p>Exemplos de como utilizar a biblioteca:</p>

```typescript
import  monguex  from 'monguex';



(async()=>{
  await monguex.connect("URL_MONGOOSE")

const userProps = {
  nome: String,
  idade: Number,
  email: String
};

const UserModel = monguex.createSchema('User',userProps,{timestamps:true})


await monguex.save(UserModel,{
    nome: 'John Doex',
    idade: 25,
    email: 'john.doex@example.com',
 })

})()

```

