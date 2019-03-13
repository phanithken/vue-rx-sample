<template>
    <figure>
        <h3>{{ title }} <span v-if="data && !loading">({{ data.total_count }} results)</span></h3>
        <h2 v-show="typing">Stop typing to search...</h2>
        <h2 v-show="loading">Loading...</h2>
        <h5 v-if="data && !loading">
            <a class="button" @click="back">Back</a> {{ page }} / {{ totalPage }} <a class="button" @click="next">Next</a>
        </h5>
        <p v-if="error">{{ error }}</p>
        <div>
            <table style="position: absolute; left: 37%;" v-if="data && !loading">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Star</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="x in data.items" :key="x.id">
                        <th>
                            <a :href="x.html_url" target="_blank">{{ x.name }}</a>
                        </th>
                        <th>
                            <a :href="x.owner.html_url" target="_blank">{{ x.owner.login }}</a>
                        </th>
                        <th>
                            {{ x.stargazers_count }}
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    </figure>
</template>

<script>
import { Observable, timer, combineLatest, of } from 'rxjs'
import { pluck, debounceTime, tap, filter, flatMap, catchError } from 'rxjs/operators'
import * as API from '@/services/api'

export default {
    name: 'result',
    props: {
        q: String
    },
    data: function () {
        return {
            title: '',
            typing: false,
            loading: false,
            page: 1,
            error: ''
        }
    },
    subscriptions: function () {

        console.log('************ subscription **************')
        console.log(this)

        const $q = this.$watchAsObservable('q', { immediate: true })
            .pipe(
                pluck('newValue'),
                tap(() => { this.typing = true }),
                debounceTime(1500),
                tap(() => { this.typing = false }),
                filter((q) => !!q),
                tap(() => { this.page = 1 }) // reset page if query changed
            )

        const $page = this.$watchAsObservable('page', { immediate: true })
            .pipe(pluck('newValue'))

        return {
            data: combineLatest($q, $page, (q, page) => ({ q, page }))
                    .pipe(
                        debounceTime(50), // prevent double request when query and page change at same time
                        tap(() => {
                            // reset error and show loading
                            this.error = ''
                            this.loading = true
                        }),
                        tap(({ q }) => { this.title = q }),
                        flatMap(({ q, page }) => API.search(q, page)),
                        catchError((err) => {
                            this.error = err.message || 'something went wrong'
                            return of(null)
                        }),
                        tap(() => { this.loading = false })
                    )
        }
    },
    computed: {
        totalPage: function () {
            if (!this.data) return 0
            const len = this.data.items && this.data.items.length || 1
            return Math.ceil(this.data.total_count / len)
        }
    },
    methods: {
        back: function () {
            if (this.page >  1) --this.page
        },
        next: function () {
            if (this.page < this.totalPage) ++this.page
        }
    }
}
</script>

<style>

</style>
