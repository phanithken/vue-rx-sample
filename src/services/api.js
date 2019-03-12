import axios from 'axios'
import { Observable, from } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

const API_URL = 'https://api.github.com'

const http = axios.create({
    baseURL: API_URL
})

const get = (url, config) => from(http.get(url, config))
                                .pipe(
                                    map((resp) => resp.data),
                                    catchError((error) => Observable.throw(error.response.data))
                                )

export const search = (q, page) => get('/search/repositories', { params: { q, sort: 'stars', page } })