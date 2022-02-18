# synapbox-challange

Synapbox Services Code Challenge

##### .env

```
#GENERALS
APP_NAME=TREE-API
APP_PORT=3000
ROOT_NODE=1

DB_PATH_ADD_TEST=../db-test-add-test
DB_PATH_DELETE_TEST=../db-test-delete-test
DB_PATH_UPDATE_TEST=../db-test-update-test
DB_PATH_GETALL_TEST=../db-test-getall
```

#### Running the app

```bash
# development
$ yarn  start

# watch mode
$ yarn  start:dev

# production mode
$ yarn  start:prod
```

#### Test

```bash
# unit tests
$ yarn  test


# test coverage
$ yarn  test:cov
```

#### REST API

The REST API to the example app is described below.

#### Get tree

`GET /api/tree/`

    curl -i -H 'Accept: application/json' http://localhost:3000/api/tree

#### Add node

`POST /api/tree/`

    curl --location --request POST 'http://localhost:3000/api/tree'  --header 'Content-Type: application/json'  --data-raw '{"parent":14,"label":"lion"}

#### Delete node

`DELETE /api/tree/`

    curl --location --request DELETE 'http://localhost:3000/api/tree/14'

#### Update node

`PUT /api/tree/`

    curl --location --request PUT 'http://localhost:3000/api/tree/1'  --header 'Content-Type: application/json'   --data-raw '{"current-id": 6}'

#### Response

    {
    "id": 1,
    "label": "root",
    "children": [
        {
            "id": 2,
            "label": "ant",
            "children": []
        },
        {
            "id": 3,
            "label": "bear",
            "children": [
                {
                    "id": 4,
                    "label": "cat",
                    "children": []
                },
                {
                    "id": 5,
                    "label": "dog",
                    "children": [
                        {
                            "id": 6,
                            "label": "elephant",
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "id": 7,
            "label": "frog",
            "children": []
        }
    ]

}
