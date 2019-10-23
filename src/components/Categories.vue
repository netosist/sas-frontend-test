<template>
    <div class="container">
        <main-header></main-header>
        <section class="categories">
            <div class="title">
                <h1>Categories</h1>
            </div>
            <div class="categories-container">
                <div class="category-box" v-for="cat in categories" v-bind:key="cat.id" @click.prevent="goToQuestion(cat.id)">
                    <span class="category-name">{{cat.name}}</span>
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
  name: 'Categories',
  data () {
    return {
        userId: undefined,
        categories: []
    }
  },
  components: {
    'main-header': Header
  },
  methods: {
      getCategories: function() {
          axios.get('https://opentdb.com/api_category.php')
          .then( response => {
              this.categories = response.data.trivia_categories.sort( (a,b) => a.name.localeCompare(b.name));
          })
          .catch( e => console.log('error ',e));
      },
      goToQuestion: function(id) {
          this.$router.push({ path: `/question/${id}` })
      },
      createOrGetUser: function() {
          this.userId = localStorage.getItem('user-id');

            if(this.userId == null) {
                firebase.firestore().collection('user').add({}).then(response => {
                    localStorage.setItem('user-id',response.id);
                })
                .catch(e => console.log(e));
            }

          console.log('userId',this.userId);
      }
  },
  mounted () {
      this.createOrGetUser();
      this.getCategories();
  }
}
</script>

<style scoped>

    section.categories {
        padding-top: 56px; 
        padding-left: 167px; 
        padding-right: 167px;       
    }

    div.title > h1 {
        font-size: 44px;
        font-weight: lighter;
    }

    div.categories-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    div.category-box {
        width: 239px;
        height: 104px;
        background: #FFFFFF;        
        border: 1px solid #E4E4E6;
        box-sizing: border-box;        
        box-shadow: 0px 1px 4px rgba(52, 60, 88, 0.4);
        border-radius: 8px;
        /* if to use the especified the text will be displayed out of the box */
        padding: 1rem;
        margin-bottom: 1rem;
        cursor: pointer;
    }

    span.category-name {
        font-size: 18px;
    }

    @media (max-width: 992px) 
    {
        section.categories {
            padding-left: 40px; 
            padding-right: 40px;       
        }

         div.category-box {
            width: 210px;
        }
    }

    @media (max-width: 768px) 
    {
        section.categories {
            padding-left: 32px; 
            padding-right: 32px;       
        }

         div.category-box {
            width: 158px;
        }
    }

    @media (max-width: 576px) 
    {
        section.categories {
            padding-left: 24px; 
            padding-right: 24px;       
        }

         div.category-box {
            width: 165px;
        }
    }

    @media (max-width: 375px) 
    {
        section.categories {
            padding-left: 16px; 
            padding-right: 16px;       
        }

         div.category-box {
            width: 163px;
        }
    }

</style>