<template>
    <div class="container">
        <main-header></main-header>
        <section class="question-container">
            <div class="title">
                <h4>{{question.category}}</h4> <span class="close" @click.prevent="goTo('/')"><i class="circle">x</i> Fechar</span>
            </div>
            <div class="question-box">
                <div class="question-header">
                    <h6>Question {{questionCount}}</h6> <span class="difficulty">{{stars}} {{question.difficulty}}</span>
                </div>
                <div class="clear-fix"></div>
                <div class="question">
                    <p v-html="question.question"></p>
                </div>
                <div class="answer-box" @click.prevent="selectAnswer(answer)" :class="{ 'selected' : answer == selectedAnswer }" v-for="(answer, index) in answers" v-bind:key="index">
                    {{answer}}
                </div>
                <div class="question-footer">
                    <button class="btn" @click.prevent="answerQuestion()" :class="{ 'btn-primary' : selectedAnswer != '' }">Answer</button>
                </div>
            </div>
            <div v-if="showFeedback" class="feedback-container">
                <div class="feedback-box" :class="{'feedback-success' : selectedAnswer == question.correct_answer, 'feedback-error' : selectedAnswer != question.correct_answer }">
                    <font-awesome-icon v-if="selectedAnswer == question.correct_answer" icon="check-circle" class="icon-success"/>   
                    <font-awesome-icon v-if="selectedAnswer != question.correct_answer" icon="times-circle" class="icon-error"/>   
                    <span class="feedback-message">{{feedbackMessage}}</span>                    
                    <button @click.prevent="goForward()" class="btn btn-primary space-top">Go Forward&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font-awesome-icon icon="arrow-right" /></button>
                </div>
                <div class="feedback-overlay"></div>                
            </div>
        </section>
    </div>
</template>

<script>

import Header from './Header.vue'
import axios from 'axios'
import firebase from 'firebase'

export default {
    name: 'Question',
    components: {
        'main-header': Header
    },
    data() {
        return {
            difficulties: ['easy','medium','hard'],
            currentDifficulty: 1,
            questionCount: 1,
            categoryId: '',
            question: {
                category: ''
            },
            answers: [],
            selectedAnswer: '',
            showFeedback : false,            
            correctAnswersCount: 0,
            wrongAnswersCount: 0,
            userAnswerCount: 0
        }        
    },
    methods: {
        getCategory: function() {

            this.answers = [];            

            axios.get('https://opentdb.com/api.php?amount=1&difficulty='+this.difficulties[this.currentDifficulty]+'&type=multiple&category='+this.categoryId)
            .then( response => {
                this.question = response.data.results[0];
                this.answers.push(this.question.correct_answer);
                this.question.incorrect_answers.forEach(element => {
                    this.answers.push(element);
                });

                this.answers = this.answers.sort(function (a, b){ 
                    return Math.floor(Math.random() * 10);
                });                

                console.log(this.question);

                this.getUserAnswers();
            })
            .catch( e => console.log('Error ',e));

            
        },
        goTo: function(path) {
            this.$router.push({ 'path': path });
        },
        addDifficultyLevel: function() 
        {
            if(this.currentDifficulty<3){
                this.currentDifficulty += 1;
            }
        },
        removeDifficultyLevel: function()
        {
            if(this.currentDifficulty>0) {
                this.currentDifficulty -= 1;
            }
        },
        selectAnswer: function(answer) {
            this.selectedAnswer = answer;
        },                
        answerQuestion: function() {

            if(this.selectedAnswer!='')
            {
                
                let userAnswer = {
                    'userAnswer' : this.selectedAnswer,
                    'question' : this.question.question,
                    'correct_answer' : this.question.correct_answer,
                    'isAnswerCorrect' : this.question.correct_answer == this.selectedAnswer,
                    'answerDateTime' : new Date(),
                    'difficulty' : this.question.difficulty
                }

                if(this.question.correct_answer == this.selectedAnswer){
                    this.correctAnswersCount += 1;
                    this.wrongAnswersCount = 0;
                    if(this.correctAnswersCount == 2) {
                        this.addDifficultyLevel();
                        this.correctAnswersCount = 0;
                    }
                }
                else
                {
                    this.wrongAnswersCount += 1;
                    this.correctAnswersCount = 0;
                    if(this.wrongAnswersCount == 2) {
                        this.removeDifficultyLevel();
                        this.wrongAnswersCount = 0;
                    }
                }

                firebase.firestore()
                        .collection('answers')
                            .doc(localStorage.getItem("user-id"))
                                .collection(this.question.category)
                                    .add(userAnswer)
                                    .then(doc => {
                                        this.showFeedback = true;
                                    })
                                    .catch(e => {
                                        console.log(e);
                                    });
            }            
        },
        goForward: function() {
            this.selectedAnswer = '';
            this.getCategory();
            this.showFeedback = false;
        },
        getUserAnswers: function() {
            firebase.firestore()
                        .collection('answers')
                            .doc(localStorage.getItem("user-id"))
                                .collection(this.question.category)                                
                                    .get()
                                        .then(snapshot => {
                                            this.userAnswerCount = snapshot.size;

                                            if(this.userAnswerCount == 10) 
                                            {                                            
                                                this.goTo('/report/'+this.categoryId);
                                            }

                                        })
                                        .catch(e => console.log(e));
        }
    },
    mounted () {
        this.categoryId = this.$route.params.id;
        this.getCategory();        
    },
    computed: {
        feedbackMessage: function() {
            if(this.selectedAnswer == this.question.correct_answer) {
                return 'Right answer!';
            }
            else
            {
                return 'Wrong answer!';
            }
        },
        stars: function() {
            switch (this.question.difficulty) {
                case 'easy' : {
                    return '★';
                    break;
                }
                case 'medium': {
                    return '★★';
                    break;
                }
                case 'hard': {
                    return '★★★';
                    break;
                }
                default: {
                    return '';
                }
            }            
        }
    }
}
</script>

<style scoped>

    .clear-fix {
        clear: both;
    }

    section.question-container {
        padding-top: 56px;
        padding-bottom: 97px;
        height: calc(100% - 56px);
        min-width: 700px;
        max-width: 700px;
        margin: 0 auto;
    }    

    div.title {
        display: inline-block;        
        width: 100%;
    }

    div.title > h4 {
        width: 580px;
        height: 32px;
        font-size: 24px;
        margin: 10px 0;        
        float: left; 
        color: #1E2124;       
    }

    span.close {
        float: right;
        width: 75px;
        height: 20px;
        font-weight: bold;
        line-height: 32px;
        margin: 10px;
        color: #53595F;
        text-align: right;
        letter-spacing: 0.4px;
        font-size: 14px;
    }

    i.circle {
        border: 2px solid #53595F;
        border-radius: 50%; 
        font-style: normal;
        padding: 0.0rem 0.2rem;
    }

    div.question-box {
        background: #FFFFFF;
        border: 1px solid #E4E4E6;
        box-sizing: border-box;
        box-shadow: 0px 1px 4px rgba(52, 60, 88, 0.4);
        border-radius: 8px;
        padding: 32px 40px 27px 40px;
        font-size: 18px;
        color: #000000;
    }

    div.question-header > h6 {
        font-size: 18px;
        margin: 0;
        float:left;
    }

    div.question {
        font-size: 16px;
        letter-spacing: 0.2px;
        color: #1E2124;
        margin: 24px 0 32px;
    }

    div.answer-box {
        background: #FFFFFF;
        border: 1px solid #C9CCCF;
        box-sizing: border-box;
        box-shadow: 0px 1px 2px rgba(52, 60, 88, 0.4);
        border-radius: 8px;
        padding: 12px 16px 24px;
        font-size: 16px;
        color: #1E2124;
        margin-bottom: 16px;
        cursor: pointer;
    }

    span.difficulty {
        float: right;
        width: 86px;
        height: 20px;
        background: rgba(52, 60, 88, 0.2);        
        border-radius: 14px;              
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        color: #343C58;
    }

    div.question-footer {
        width: 100%;
        text-align: center;
        margin: 48px auto 22px;
    }

    button.btn {
        text-align: center;
        background: #C9CCCF;
        border-radius: 8px;
        padding: 11px 24px;
        font-size: 16px;
        color: #FFFFFF;
        
    }

    button.space-top {
        margin-top: 31px;
    }

    button.btn-primary {
        background: #0467DB;
    }

    .selected {
        border: 3px solid #0467DB !important;
    }

    .feedback-container {
        position: fixed;
        width: 100%;
        height: 100%;
        left:0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .feedback-overlay {
        position: fixed; 
        width: 100%; 
        height: 100%; 
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #1E2124; 
        opacity: 0.5;
        cursor: pointer;
    }

    .feedback-box {
        position: relative;
        width: 328px;
        height: 228px;
        background: #FFFFFF;        
        box-sizing: border-box;
        box-shadow: 0px 3px 6px rgba(52, 60, 88, 0.4);
        border-radius: 8px;
        margin: 226px auto;
        z-index: 2;
        text-align: center;
    }

    .feedback-success {
        border: 3px solid #32CB82;
    }

    .feedback-error {
        border: 3px solid #FF4F4F;
    }

    .icon-success {
        color: #32CB82;
        width:47px;
        height:47px;
        margin: 30px 140px 14px;
    }

    .icon-error {
        color: #FF4F4F;
        width:47px;
        height:47px;
        margin: 30px 140px 14px;
    }

    span.feedback-message {
        color: #343C58;
        font-size: 24px;
        margin: 0 auto 31px;
    } 

    @media (max-width: 992px) 
    {
        section.question-container {
            padding-top: 56px;
            padding-bottom: 97px;
            height: calc(100% - 56px);
            min-width: 700px;
            margin: 0 auto;
        }  
    }

    @media (max-width: 768px) 
    {
        section.question-container {
            padding: 56px 32px 96px;            
            height: calc(100% - 56px);
            min-width: 527px;
        }  
    }

    @media (max-width: 576px) 
    {
        section.question-container {
            padding: 56px 24px 97px;
            height: calc(100% - 56px);
            min-width: 376px;
        }  

        div.title > h4 {
            width: 406px;      
        }
    }

    @media (max-width: 375px) 
    {
        section.question-container {
            padding: 56px 0px 97px;
            height: calc(100% - 56px);
            min-width: 373px;
        }  

        div.title > h4 {
            width: 223px;      
        }
    }

</style>