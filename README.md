<a id="readme-top"></a>

<div align="center">
  <h3 align="center">To-Do List Backend</h3>

  <p align="center">
    A simple backend for a to-do list application.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#built-with">Built With</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#rest-api">REST API</a></li>
  </ol>
</details>

### Built With

- Node.js
- Express.js
- PostgresDB

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- yarn

  ```sh
  npm install --global yarn
  ```

  - alternative installation methods can be found [here](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

- docker
  - Installation guides can be found [here](https://docs.docker.com/engine/install/)
- postgres
  - Installation guides can be found [here](https://www.postgresql.org/download/)
- flyway
  - For Mac users with brew installed:
    ```
    brew install flyway
    ```
  - Otherwise, installation guides can be found [here](https://documentation.red-gate.com/fd/command-line-184127404.html)

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:visca189/todo-list-be.git
   ```
2. Install YARN packages
   ```sh
   yarn
   ```
3. Create .env file based on .env.sample
4. Run docker-compose
   ```sh
   docker-compose up -d
   ```
5. Run flyway migration

   ```sh
   flyway migrate -configFiles=./flyway/flyway.toml -environment=dev
   ```

6. Run the project

   - For development:

   ```sh
   yarn start:dev
   ```

   - For build:

   ```sh
   yarn start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# REST API

The REST API to the to do list backend is described below.

## Get list of Duties

### Request

`GET /api/v1/duty`

### Response

Status: 200 OK

```json
[
  {
    "id": "124f94ce-3339-4ba4-a690-06b08ca8e6de",
    "name": "buy food",
    "is_completed": false
  }
]
```

Status: 404 Not Found

```json
{
  "status": 404,
  "name": "DUTY_NOT_FOUND",
  "message": "No duty found"
}
```

## Create a new Duty

### Request

`POST /api/v1/duty/:id`

### Response

Status: 200 OK

```json
{
  "id": "124f94ce-3339-4ba4-a690-06b08ca8e6de",
  "name": "buy food",
  "is_completed": false
}
```

## Get a specific Duty

### Request

`GET /api/v1/id`

### Response

Status: 200 OK

```json
{
  "id": "124f94ce-3339-4ba4-a690-06b08ca8e6de",
  "name": "buy food",
  "is_completed": false,
  "custom_data": {},
  "created_at": "2024-08-11T09:55:29.297Z",
  "updated_at": "2024-08-11T09:55:29.297Z"
}
```

Status: 404 Not Found

```json
{
  "status": 404,
  "name": "DUTY_NOT_FOUND",
  "message": "Duty with id 14540bb2-ee2e-474f-8e7d-07361469aec7 not found"
}
```

## Change a Duty

### Request

`PUT /api/v1/duty/:id`

### Response

Status: 200 OK

```json
{
  "id": "124f94ce-3339-4ba4-a690-06b08ca8e6de",
  "name": "buy ice cream",
  "is_completed": false
}
```

Status: 404 Not Found

## Delete a Duty

### Request

`DELETE /api/v1/duty/:id`

### Response

Status: 204 No Content

<p align="right">(<a href="#readme-top">back to top</a>)</p>
```
