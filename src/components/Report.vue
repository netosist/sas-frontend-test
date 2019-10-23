<template>
    <div class="container">
        <main-header></main-header>
        <section class="report-container">
            <div class="report-box">
                <div class="report-box-header">
                    <h1>Congratulations!</h1>
                    <h4>You have finished the test</h4>
                </div>
                <div class="report-message">
                    See how you perform on issues
                </div>
                <div class="report-resume">
                    <div class="hits">
                        <span class="hits-total">{{totalHits}}</span><br>
                        hits
                    </div>
                    <div class="misses">
                        <span class="misses-total">{{totalMisses}}</span><br>
                        misses
                    </div>
                </div>
                <div class="report">
                    <div class="column-block">
                        <label>Easy</label><br>
                        Hits: {{report['easy'].hits}}<br>
                        Misses: {{report['easy'].misses}}
                    </div>
                    <div class="divider"></div>
                    <div class="column-block">
                        <label>Medium</label><br>
                        Hits: {{report['medium'].hits}}<br>
                        Misses: {{report['medium'].misses}}
                    </div>
                    <div class="divider"></div>
                    <div class="column-block">
                        <label>Hard</label><br>
                        Hits: {{report['hard'].hits}}<br>
                        Misses: {{report['hard'].misses}}
                    </div>                    
                </div>
                <div class="report-box-footer">
                    <button @click="goTo('/')" class="btn btn-primary">Back to begin</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script>

import Header from './Header.vue'
import axios from 'axios'
import firebase from 'firebase'

export default {
    name: 'Report',
    components: {
        'main-header': Header
    },
    data() {
        return {
            totalHits: 0,
            totalMisses: 0,
            question: {
                category: ''
            },
            report: {
                'easy' : {
                    hits: 0,
                    misses: 0
                },
                'medium' : {
                    hits: 0,
                    misses: 0
                },
                'hard' : {
                    hits: 0,
                    misses: 0
                }
            },
            categoryId:''
        }
    },
    methods: {
        goTo: function(path) {
            this.$router.push({ 'path': path });
        },
        getCategory: function() {

            this.answers = [];            

            axios.get('https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple&category='+this.categoryId)
            .then( response => {
                this.question = response.data.results[0];
                this.getUserAnswers();
            })
            .catch( e => console.log('Error ',e));

            
        },
        getUserAnswers: function() {
            firebase.firestore()
                        .collection('answers')
                            .doc(localStorage.getItem("user-id"))
                                .collection(this.question.category)                                
                                    .get()
                                        .then(snapshot => {
                                            snapshot.docs.forEach(answer=> {
                                                if(answer.data().isAnswerCorrect) {
                                                    this.totalHits += 1;
                                                }
                                                else 
                                                {
                                                    this.totalMisses += 1;
                                                }
                                                switch(answer.data().difficulty) {
                                                    case 'easy': {
                                                        if(answer.data().isAnswerCorrect)
                                                        {
                                                            this.report['easy'].hits +=1;
                                                        }
                                                        else
                                                        {
                                                            this.report['easy'].misses +=1;
                                                        }
                                                        break;
                                                    }
                                                    case 'medium': {
                                                        if(answer.data().isAnswerCorrect)
                                                        {
                                                            this.report['medium'].hits +=1;
                                                        }
                                                        else
                                                        {
                                                            this.report['medium'].misses +=1;
                                                        }
                                                        break;
                                                    }
                                                    case 'hard': {
                                                        if(answer.data().isAnswerCorrect)
                                                        {
                                                            this.report['hard'].hits +=1;
                                                        }
                                                        else
                                                        {
                                                            this.report['hard'].misses +=1;
                                                        }
                                                        break;
                                                    }
                                                }
                                            });
                                        })
                                        .catch(e => console.log(e));
        }
    },
    mounted() {
        this.categoryId = this.$route.params.id;
        this.getCategory();
    }
}
</script>

<style scoped>

    section.report-container {
        padding-top: 119px;
        padding-bottom: 72px;
        height: calc(100% - 56px);
        min-width: 534px;
        max-width: 534px;        
        margin: 0 auto;        
    } 

    div.report-box {        
        display: block;
        height: 577px;
        background: #FFFFFF;
        border: 0.88px solid #E4E4E6;
        box-sizing: border-box;
        box-shadow: 0px 1px 4px rgba(52, 60, 88, 0.4);
        border-radius: 7.04px;
    }

    div.report-box-header {
        background-color: #438DE4;
        width: 534px;
        height: 237px;
        border-top-left-radius: 7.04px;
        border-top-right-radius: 7.04px;
        text-align: center;
        color: #FFFFFF;
    }

    div.report-box-header > h1 {
        font-size: 36px;
        margin: 0;
        padding: 74px 0 0;
    }

    div.report-box-header > h4 {
        font-size: 18px;
        font-style: normal;
        font-weight: normal;
        margin: 0;
        padding: 0;
    }

    div.report-message {
        margin: -19px auto;
        height: 35px;
        width: 252px;
        background: #FFFFFF;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        text-align: center;
        line-height: 35px;
        color: #343C58;
        font-size: 14px;
        font-weight: bold;
    }

    div.report-resume {
        margin: 58px auto 40px;
        width: 199px;
        height: 57px;
        background: rgba(52,60,88,0.08);
        border-radius: 10px;
    }

    div.hits {
        float:left;
        height: 100%;
        display: block;
        width: 50%;
        text-align: center;
        font-size:13px;
    }
    div.misses {
        float:right;
        height: 100%;
        display: block;
        width: 50%;
        text-align: center;
        font-size:13px;
    }
    
    span.hits-total {
        font-size: 28px;
        height: 36px;
        line-height: 36px;
    }

    span.misses-total {
        font-size: 28px;
        height: 36px;
        line-height: 36px;
    }

    div.report {
        display: inline-block;
        width: 402px;
        height: 60px;
        padding: 0px 66px;
    }

    div.column-block {
        display: inline-block;
        width:20%;
        font-size: 14px;
        color: #343C58;
        letter-spacing: 0.44px;
    }

    div.column-block > label {
        font-weight: bold;
    }

    div.divider {
        display:inline-block;
        width:0px;
        height:100%;
        border: 1px solid #B8BED5;
        padding:0;
        margin:0 8%;
    }

    button.btn {
        text-align: center;
        background: #C9CCCF;
        border-radius: 8px;
        padding: 11px 24px;
        font-size: 16px;
        color: #FFFFFF;
        cursor: pointer;
    }

    button.space-top {
        margin-top: 31px;
    }

    button.btn-primary {
        background: #0467DB;
    }

    .report-box-footer {
        width: 100%;
        text-align: center;
        margin: 58px auto 27px;
    }
</style>