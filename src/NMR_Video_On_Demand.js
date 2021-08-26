


  $("#body-content").addClass("on-demand-body-content")



const truncate = Vue.component('truncate',{
  name: 'Truncate',
  template: /*html*/`
  <div>
  <div v-if="!show && !isHTML">
    <span :class="textClass">
      {{ truncate(text) }}
    </span>
    <button
      v-if="showToggle && text.length >= length"
      :class="actionClass"
      @click="toggle">{{ clamp }}</button>
  </div>
  <div v-else-if="!show && isHTML">
    <span
      :class="textClass"
      v-html="truncate(text)" />
    <button
      v-if="showToggle && text.length >= length"
      :class="actionClass"
      @click="toggle">{{ clamp }}</button>
  </div>
  <div v-if="show && !isHTML">
    <span>{{ text }}</span>
    <button
      v-if="showToggle && text.length >= length"
      :class="actionClass"
      @click="toggle">{{ less }}</button>
  </div>
  <div v-else-if="show && isHTML">
    <div
      v-if="text.length >= length"
      v-html="text" />
    <button
      v-if="showToggle && text.length >= length"
      :class="actionClass"
      @click="toggle">{{ less }}</button>
    <p v-else>
      {{ h2p(text) }}
    </p>
  </div>
</div>
  
  
  `,
  props: {
    truncated: {
      type: Boolean,
      default: true
    },
    collapsedTextClass: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      required: true,
    },
    clamp: {
      type: String,
      default: 'Read More',
    },
    length: {
      type: Number,
      default: 100,
    },
    less: {
      type: String,
      default: 'Show Less',
    },
    type: {
      type: String,
      default: 'text',
    },
    actionClass: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    }
  },
  created() {
    // this.show = this.truncated

    // this.toggle(this.truncated)
  },
  data() {
    return {
    };
  },
  computed: {
    isHTML() {
      return this.type === 'html';
    },
    textClass() {
      return (this.textLength > this.length && this.collapsedTextClass) ? this.collapsedTextClass : '';
    },
    textLength() {
      if (this.isHTML) {
        // We need the length of the text without the html being considered
        // This ensures we provide the right calculation for when to show/hide the more link
        const text = this.text.replace(/<[^>]*>/g, '');
        return text.length;
      }

      return this.text.length;
    },
    showToggle() {
      return this.textLength > this.length;
    },
  },
  methods: {
    truncate(string) {
      if (string) {
        if (this.type === 'html') return h2p(string, this.length);
        let tempStr = string.toString().substring(0, this.length);
        if (tempStr.length > 50){
          tempStr += "..."
        }
        return tempStr
      }

      return '';
    },
    toggle(override) {
      // use the override value if it is set as a boolean
      // const toggled = typeof override === 'boolean' ? override : !this.show;

      // this.show = toggled;
      this.$emit('toggle', this.show);
    },
  },
  watch: {
    truncated(value) {
      this.toggle(value)
    }
  },
});

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
              v-if="vod_config.thumbnail_tag === 'div'"
              :style='{backgroundImage: "url(" + session.thumb_with_play_button + ")"}'
              class="thumbnail-container"
            ></div>
            <img v-else-if="vod_config.thumbnail_tag === 'img' || !vod_config.thumbnail_tag" :src="session.thumb_with_play_button" alt="img" style="width: 100%; height: auto;">
          </div>
          <h2 class="session-title">{{ session.title }}</h2>

        </a>
        <div class="video-description-wrapper">
          <p class="session-description">
            <transition>
            <truncate :truncated="false" :show="active_description_id === session.id" @toggle="$emit('description_clicked', session.id)" collapsedTextClass="collapsed-text" class="expended-text" :clamp="vod_config.desc_show_more_text" :length="vod_config.desc_truncate_length" :less="vod_config.desc_show_less_text" :text="session.description || ''"></truncate>
            </transition>
          </p>
        </div>
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
    components: {
      truncate,
    },
    props: {
      vod_data: {
        type: Array,
        default: () => [],
      },
      title: {
        type: String,
        default: '',
      },
      active_description_id: {
        type: String | Number,
        default: ""
      },
      vod_config: {
        type: Object,
        default: ()=> {}
      }
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
              :vod_config="vod_config"
              @video-clicked="$emit('video-clicked',$event)"
              @description_clicked="$emit('description_clicked', $event)"
              :active_description_id="active_description_id"
            ></vod-section>
          </div>
        </section>

      </div>
    `,
    props: ['sorted_vod',
      'categories','vod_config', 'active_description_id']
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
        title: "",
        subtitle: "",
        id: null,

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
          const video_url = this.selected_video_url;
          console.log(video_url)
          let iframe = $(this.$refs.videoplayer).find('iframe');
          vod_utils.setup_vimeo_player({
            iframe,
            url: window.location.href,
            title: this.selected_video_computed.title,
            video_url: this.selected_video_computed.video_url,
          })
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
            if (item.id == self.id){
              return true
            }
            else {
              return false;
            }
          })
          return selected || {};
        }
      },
      selected_video_url(){
        if (this.$route.query.vimeo_id){
          return "https://player.vimeo.com/video/" + this.$route.query.vimeo_id
        }
        else if (this.$route.query.video_url){
          return this.$route.query.video_url
        }
        else if (this.$route.query.id != null){
          this.id = this.$route.query.id
          return this.selected_video_computed.video_url
        }
      }
    },
    created () {
      if (this.$route.query.vimeo_id){
        this.id = this.$route.query.vimeo_id
      }
      else if (this.$route.query.id != null){
        this.id = this.$route.query.id
      }
    },
    mounted () {

      let self = this;
      if (this.$route.query.title){
        this.title = this.$route.query.title
      }
      if (this.$route.query.subtitle){
        this.subtitle = this.$route.query.subtitle
      }
      try{
        console.log('seting up video player analytics')
        let count = 0
        const vimeoInterval = setInterval(() => {
          console.log('interval')
          let iframe = $(self.$refs.videoplayer).find('iframe');
          if (iframe.length > 0 && self.selected_video_url){
            console
            self.setup_vimeo_player();
            clearInterval( vimeoInterval)
          }
          else {
            if (count > 10){
              clearInterval( vimeoInterval)
            }
          }
          count++
        }, 500);
      }
      catch(error){
        console.log(error)
      }

    },
 
  })
  
  
  const vod_template = /*html*/ `
  <main id="app">
    <transition name="routerFade" mode="out-in">
      <router-view :ref="$route.name" :sorted_vod="sorted_vod" :vod_config="vod_config" :categories="categories" :selected_video="selected_video" :vod_sessions="vod_sessions" :active_description_id="active_description_id" @description_clicked="description_clicked" @video-clicked="video_clicked"></router-view>
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
        !data.url 
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
      try{

        const player = new Vimeo.Player(iframe);
        const url = window.location.href;
        const video_url = data.video_url
        const title = data.title;
        this.setup_player_triggers(player, url, title, video_url);
      }
      catch(error){
        throw new Error(error.message)
      }
    },
    setup_player_triggers(player, url, title, video_url) {
      this.first_play = true;
      let self = this;
      
      let build_analytics_hit = (play_percent) => {
        let new_hit = {
          url: url || "",
          title: title || "",
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          video_url : video_url || "",
          play_percent: play_percent || 0,
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
      const vod_ref = vod_db.ref('video_analytics/' + fb_key);
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
    truncate(text, length, clamp){
      clamp = clamp || '...';
      var node = document.createElement('div');
      node.innerHTML = text;
      var content = node.textContent;
      return content.length > length ? content.slice(0, length) + clamp : content;
    }
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



  Vue.filter('truncate', vod_utils.truncate);


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
      vod_config: {},
      active_description_id: "",
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
              id: this.selected_video.id,
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
      description_clicked(id){
        if (this.active_description_id === id ){
          this.active_description_id = ""
        }
        else {
          this.active_description_id = id
        }
      }
    },
    mounted() {
      const library_id = vod_utils.keyify(window.location.pathname.split('/').slice(-1)[0])
      let final_id;
      if ( this.$route.query.library_id != null){
        final_id = this.$route.query.library_id
      }
      else if (library_id != "" && library_id != null){
        final_id = library_id
      }
      else {
        final_id = null;
      }
      const parent_vod_ref = vod_db.ref('vod_libraries').child(final_id)
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
