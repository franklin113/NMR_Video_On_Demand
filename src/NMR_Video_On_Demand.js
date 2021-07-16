


  $("#body-content").addClass("on-demand-body-content")


  const vodSection = Vue.component('vod-section', {
    template: /*html*/ `
    <div class="vod-category">
      <section
        class="session-container"
        v-for="(session,index) in vod_data"
      >
        <a class="video-click-region"
          @click="$emit('video-clicked',session)">
          <span style="display: none" class="t-span">video-click</span>
          <div class="session-thumb-container">
            <div
              :style='{backgroundImage: "url(" + session.thumb_with_play_button + ")"}'
              class="thumbnail-container"
              height="141"
              width="250"
            ></div>
          </div>
          <h2 class="session-title">{{ session.title }}</h2>
          <p class="session-description">{{ session.description }}</p>
        </a>
        <div class="resources-section d-flex flex-wrap">
          <div class="resource-item" v-if="session.resources" v-for="(resource,resource_index) in session.resources">
            <a class="resource-link btn btn-secondary" target="_Blank" :href="resource.link">
              {{resource.display_name}}
            </a>
          </div>
        </div>
      </section>
    </div>
`,
    props: {
      vod_data: {
        type: Array,
        default: () => [],
      },
      title: {
        type: String,
        default: '',
      },
    },
  });

  const vodList = Vue.component('vod-list',{
    template: /*html*/`
      <div id="vod-list-component">
        <div id="vod-page-title-section">

        </div>
        <section class="sessions-container">
          <div class="vod-category-wrapper" v-for="(cat, index) in categories">
            <div class="vod-category-header" >
              <h1 class="vod-header-text">{{cat.title}}</h1>
            </div>
            <vod-section
              :vod_data="sorted_vod[cat.id]"
              @video-clicked="$emit('video-clicked',$event)"
            ></vod-section>
          </div>
        </section>

      </div>
    `,
    props: ['sorted_vod',
      'categories','vod_config']
  })

  const vodPlayer = Vue.component('vod-player',{
    template: /*html*/`
      <div id="video-player-component">
      <div class="back-button text-left" @click="back_button_clicked">
          <i class="fas fa-arrow-left"></i> Back
          <!--<router-link class="back-button-link" :to="{ name : 'list' }"> Back</router-link>-->
      </div>
      <h1 v-if="selected_video_computed.title || title">{{ title || selected_video_computed.title}}</h1>
      <b-embed
        ref="videoplayer"
        type="iframe"
        aspect="16by9"
        :src="selected_video_url"
        allowfullscreen
      ></b-embed>

      <div id="vod-description">
        <p v-if="selected_video_computed.description">{{selected_video_computed.description}}</p>
      </div>
      </div>
    `,
    data() {
      return {
        selected_video_url: "",
        title: "",
        subtitle: "",
        vimeo_id: null,

      }
    },
    props: {
      selected_video: {
        type: Object,
        default: {}
      },
      vod_sessions: {
        type: Array,
        default: ()=>[]
      }
    },
    methods: {
      setup_vimeo_player() {
        this.$nextTick(() => {
          const video_url = this.selected_video_url;
          console.log(video_url)
          let iframe = $(this.$refs.videoplayer).find('iframe');
          const title = this.title;
          const id = this.vimeo_id;
          vod_utils.setup_vimeo_player({
            iframe,
            title,
            id
          })
        });
      },
      back_button_clicked(){
        this.$router.back();
      }
    },
    computed: {
      selected_video_computed() {
        if (Object.keys(this.selected_video).length > 0){
          return this.selected_video
        }
        else {
          let self =  this;
          const selected = this.vod_sessions.find((item)=>{
            if (item.id == self.vimeo_id || item.video_url == self.selected_video_url){
              return true
            }
            else {
              return false;
            }
          })
          return selected || {};
        }
        
      }
    },
    created () {


      
    },
    mounted () {
      if (this.$route.query.vimeo_id){
        this.selected_video_url = "https://player.vimeo.com/video/" + this.$route.query.vimeo_id
        this.vimeo_id = this.$route.query.vimeo_id
      }
      else if (this.$route.query.video_url){
        this.selected_video_url = this.$route.query.video_url
      }
      if (this.$route.query.title){
        this.title = this.$route.query.title
      }
      if (this.$route.query.subtitle){
        this.subtitle = this.$route.query.subtitle
      }
      this.setup_vimeo_player();

    },
 
  })
  
  
  const vod_template = /*html*/ `
  <main id="app">
    <transition name="routerFade" mode="out-in">
      <router-view :ref="$route.name" :sorted_vod="sorted_vod" :categories="categories" :selected_video="selected_video" :vod_sessions="vod_sessions" @video-clicked="video_clicked"></router-view>
    </transition>
    <div id="vod-footer">
      <p class="vod-footer-text">
        {{vod_config.footer_text || ""}}
      </p>
      
    </div>
    <b-modal
      v-if="vod_config.modal_player"
      ref="vod_modal"
      size="xl"
      :title="selected_video.title ? selected_video.title : ''"
      ok-only
      :no-close-on-backdrop = "true"

    >
      <b-embed
        ref="videoplayer"
        type="iframe"
        aspect="16by9"
        :src="selected_video.video_url"
        allowfullscreen
      ></b-embed>
    </b-modal>
  </main>

`;

  $('#video-on-demand').append(vod_template);

  // const vod_firebase_config = {
  //   apiKey: 'AIzaSyB_UfOy9uRdArhuIq4DaqFhWeX-pgSJHP8',
  //   authDomain: 'cgcaci21.firebaseapp.com',
  //   databaseURL: 'https://cgcaci21.firebaseio.com',
  //   projectId: 'cgcaci21',
  //   storageBucket: 'cgcaci21.appspot.com',
  //   messagingSenderId: '595065889262',
  //   appId: '1:595065889262:web:90fac884b0452a89b56eff',
  //   measurementId: 'G-M0K5LQT39Q',
  // };
  const vod_app = firebase.initializeApp(vod_firebase_config, 'vod_app');
  const vod_db = firebase.database(vod_app);
  if (window.location.hostname === "localhost"){
    console.log('---------------- EMULATOR ---------------------' )
    vod_db.useEmulator('localhost','9007')
  }
  const vod_utils = {
    first_play: true,
    analytics_location: window.location.pathname.split('/').slice(-1)[0],
    user_data: {
      first_name: vod_user_data.first_name,
      last_name: vod_user_data.last_name,
      email: vod_user_data.email,
      event_attendee_id: vod_user_data.event_attendee_id,
      user_type: vod_user_data.user_type.toLowerCase().trim(),
    },
    give_video_player_point(vimeoID, play_percent) {
      //activity, today, item, multiplier, points_arr, uid
      console.log('running give points');
      let activity = 'on_demand_video';
      let today = '';
      let item = vimeoID.toString();
      let multiplier = play_percent;
      let points_arr = null;
      let uid = firebase.auth().currentUser.uid;
      let location = 'vod_library';
      try {
        nmrgames.give_points(
          activity,
          today,
          item,
          multiplier,
          points_arr,
          uid,
          location
        );
      } catch (error) {}
      // trigger_vod_animation(videoName);
    },

    build_analytics_obj(data) {
      if (
        data.play_percent == null ||
        !data.vimeo_id ||
        !data.url ||
        !data.title
      ) {
        console.log('bad data passed to build analytics object: ', data);
        throw 'Bad data passed to build_analytics_obj';
      } else {
        return data;
      }
    },
    get_index(target_arr, item) {
      const index = target_arr.findIndex((arr_item) => arr_item.id === item.id);
      return index;
    },
    /**
     * 
     * @param {Obj} data {
     *  iframe - an iframe dom element
     *  title - the title of the video
     *  id - the vimeo id of the video
     * }
     */
    setup_vimeo_player(data){
      const iframe = data.iframe;
      const player = new Vimeo.Player(iframe);
      const url = window.location.href;
      const title = data.title;
      const id = data.id;
      this.setup_player_triggers(player, url, title, id);
    },
    setup_player_triggers(player, url, title, id) {
      this.first_play = true;
      let self = this;

      let build_analytics_hit = (play_percent) => {
        let new_hit = {
          url: url,
          title: title,
          vimeo_id: id,
          play_percent: play_percent,
          ...this.user_data,
        };
        return new_hit;
      };
      let process_player_event = (play_percent) => {
        let new_hit = this.build_analytics_obj(
          build_analytics_hit(play_percent)
        );
        self.vod_logger(new_hit);
      };
      player.on('play', function () {
        if (self.first_play === true) {
          self.first_play = false;
          console.log('first play: ');
          process_player_event(0);
        }
      });

      let playPercent = [false, false, false, false];
      player.on('timeupdate', function (event) {
        const current_play_percent = event.percent;
        if (event.percent > 0.25 && playPercent[0] === false) {
          playPercent[0] = true;
          console.log('user has played 25%');
          process_player_event(0.25);
        } else if (event.percent > 0.5 && playPercent[1] === false) {
          playPercent[1] = true;
          console.log('user has played 50%');
          process_player_event(0.5);
        } else if (event.percent > 0.75 && playPercent[2] === false) {
          playPercent[2] = true;
          console.log('user has played 75%');
          process_player_event(0.75);
          self.give_video_player_point(id, 1);
        } else if (event.percent == 1 && playPercent[2] === false) {
          playPercent[3] = true;
          console.log('user has played 100%');
        }
      });

      player.on('ended', function (event) {
        console.log(' video has ended!');
        process_player_event(1);
      });
    },

    vod_logger(data) {
      console.log('hi,', this.analytics_location);
      let fb_key = this.analytics_location.replace(/[\.$\s]/g, '_');
      const vod_ref = database.ref('video_analytics/' + fb_key);
      const new_item = vod_ref.push();
      new_item
        .set(data)
        .then(() => {
          console.log('sent analytics: ', data);
        })
        .catch((error) => {
          console.error('error writing to analytics database');
        });
    },

    create_comma_seperated_arr(arr_as_string) {
      let new_arr = arr_as_string
        .split(',')
        .map((item) => item.trim().toLowerCase());
      new_arr = new_arr.filter(item => item != "")
      return new_arr;
    },

    group_by(array_of_items_with_category_as_key, key) {
      console.log('hello');
      let group_items = _.groupBy(
        array_of_items_with_category_as_key,
        (x) => x[key]
      );
      console.log(group_items);
      return group_items;
    },
    add_listener(db_ref, callback) {
      db_ref.on("value", function (snapshot) {
        let val = snapshot.val();
        if (callback) {
          try {
            callback(val);
          } catch (error) {
            console.log(error)
          }
        }
      });
    },
    keyify(new_key_name) {
      const copyKey = new_key_name.replace(/[.]/g, "_");
      return copyKey;
    },
  };
  const listViewRouteName = "list"
  const videoPlayerRouteName = "videoplayer"
  const routes = [
    { name: listViewRouteName, path: "/", component: vodList},
    { name: videoPlayerRouteName, path: "/player", component: vodPlayer},

  ]

  const router = new VueRouter({
    routes, // short for `routes: routes`
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        console.log("hi there");
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(savedPosition);
          }, 250);
        });
      } else {
        return false;
      }
    },
  });

  Vue.use(VueRouter);

  const vod_vue = new Vue({
    el: '#app',
    router,
    components: {
      vodSection,
    },
    data: {
      vod_sessions: [],
      selected_video: {},
      user_type: vod_utils.user_data.user_type || "" ,
      vod_config: {}
    },
    computed: {
      sorted_vod: function () {
        let copy_of_original_videos = this.vod_sessions; // add a slice if we are sorting the original, we aren't yet

        copy_of_original_videos = copy_of_original_videos.filter((item) => {
          let is_valid = false;


          let permissions_arr = vod_utils.create_comma_seperated_arr(
            item.permissions || ""
          );
          if (permissions_arr.length == 0 || permissions_arr.includes(this.user_type) || this.user_type == "") {
            is_valid = true;
          }
          
          if (item.idx == -100) {
            is_valid = false;
          }
          return is_valid;
        });

        const grouped_vod = vod_utils.group_by(
          copy_of_original_videos,
          'category'
        );
        return grouped_vod;
      },
      categories: function (){
        const self =this;
        const filtered_cats = this.vod_config && this.vod_config.categories ? this.vod_config.categories.filter((cat)=>cat.id in self.sorted_vod) : []
        return filtered_cats;
      }
    },

    methods: {
      handle_child_added(target_arr, new_item) {
        target_arr.push(new_item); //todo -- get the index this should be inserted next to
      },
      handle_child_changed(target_arr, new_item) {
        let new_item_index = vod_utils.get_index(target_arr, new_item);
        target_arr.splice(new_item_index, 1, new_item);
      },
      handle_child_removed(target_arr, old_item) {
        let new_item_index = vod_utils.get_index(target_arr, old_item);
        target_arr.splice(new_item_index, 1);
      },
      showModal() {
        this.$refs['vod_modal'].show();
      },
      hideModal() {
        this.$refs['vod_modal'].hide();
      },
      video_clicked(video_obj) {
        this.selected_video = Object.assign({}, video_obj);
        if (this.vod_config.modal_player == true){
          this.showModal();
          this.setup_vimeo_player();
        }
        else {
          this.$router.push({
            name: videoPlayerRouteName,
            query: {
              vimeo_id: this.selected_video.id,
            }
          })
        }

      },
      setup_vimeo_player() {
        this.$nextTick(() => {
          let iframe = $(this.$refs.videoplayer).find('iframe');
          const url = window.location.href;
          const title = this.selected_video.title;
          const id = this.selected_video.id;
          vod_utils.setup_vimeo_player({
            iframe,
            title,
            id
          })
        });
      },
    },
    mounted() {
      const library_id = vod_utils.keyify(window.location.pathname.split('/').slice(-1)[0])
      const parent_vod_ref = vod_db.ref('vod_libraries').child(library_id)
      const vod_ref = parent_vod_ref.child('vod_library').orderByChild('idx');
      const vod_config_ref =  parent_vod_ref.child('vod_library_config')

      let self = this;

      vod_ref.on('child_added', (data) => {
        let new_item = data.val();
        self.handle_child_added(self.vod_sessions, new_item);
      });

      vod_ref.on('child_changed', (data) => {
        let new_item = data.val();
        self.handle_child_changed(self.vod_sessions, new_item);
      });

      vod_ref.on('child_removed', (data) => {
        let new_item = data.val();
        self.handle_child_removed(self.vod_sessions, new_item);
      });

      vod_utils.add_listener(vod_config_ref,(val)=> {
        self.vod_config = val != null ? val : {}
      })

      // add the logo to the navbar
      $('#webNavigationTop').prepend(
        `<div class="mckesson-demand-header-logo"></div>`
      );
    },

  });
