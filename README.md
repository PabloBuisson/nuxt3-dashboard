# MY DASHBOARD

A Nuxt application which show how to handle **HTTP requests**, **routing**, **authentication**, **state management** and more.

## :rocket: Goals of the project

* Create a **dark theme**
* Be familiar with **Nuxt 3**
* Be familiar with **Vue Composition API**
* Be familiar with **Vite** (env variables)
* Be familiar with **Pinia** to manage data
* Add **authentication**
* Create custom **Form Validation**
* Learn **TailwindCSS**

## :dart: Presentation of the project

* **My Dashboard** is an application to help you customize your very personal dashboard.
* The application is built around the core concepts of *Nuxt.js* : pages, composables, middleware, HTTP requests, form validation, authentication, state management, routing and many more.

## :white_check_mark: TODOS

* Add a loader ?
* Customize the toaster
* Add ```tags`` to depict of topics a tile
* Add scroll animations
* Refactoring
* Deploy online
  
## :iphone: Images

TODO

## 🏍 Run the project
1. Clone the repo
2. Create a ``.env`` file at the root of the project
3. Add your variables :
```sh
NUXT_FIREBASE_URL=""
NUXT_FIREBASE_AUTH_SIGNUP_ENTRYPOINT=""
NUXT_FIREBASE_AUTH_LOGIN_ENTRYPOINT=""
NUXT_FIREBASE_REFRESH_TOKEN_ENTRYPOINT=""
NUXT_FIREBASE_API_KEY=""
```
4. Install the dependencies
```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```
5. Start the development server on http://localhost:3000
```bash
npm run dev
```

## :package: Packages

* **VueUse** to handle dates gracefully
* **NuxtIcon** for the icons of the application
* **Pinia** for state management
* **TailwindCSS** for the design
* **Tailvue** for the toaster

## :pushpin: Technologies

* Node v16.13.2
* Nuxt 3.0.0