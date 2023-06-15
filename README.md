# MY DASHBOARD

A Nuxt application which show how to handle **HTTP requests**, **routing**, **authentication**, **state management** and more.

Online demo : [Nuxt3 Dashboard](https://nuxt3-dashboard-f3dd0.web.app/)

:bulb: The demo is *not built with SSR* (yet). The main idea of the demo is to show how the project looks like.

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

## :white_check_mark: Todos

* Add images to README
* Add gif to README
* Add a loader ?
* Add ``tags`` to depict topics of a tile
* Add scroll animations
* Refactoring
* Deploy online with server
  
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
6. Add meta properties to the meta object ``useHead`` in pages/index.vue

## :package: Packages

* **VueUse** to handle dates gracefully
* **NuxtIcon** for the icons of the application
* **Pinia** for state management
* **TailwindCSS** for the design
* **Tailvue** for the toaster

## :pushpin: Technologies

* Node v16.13.2
* Nuxt 3.0.0
* Firebase