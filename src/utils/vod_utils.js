import { groupBy } from 'lodash'
const vod_user_data = { userType: '' }
const vod_utils = {
  first_play: true,
  analytics_location: window.location.pathname.split('/').slice(-1)[0],
  user_data: {
    first_name: vod_user_data.first_name,
    last_name: vod_user_data.last_name,
    email: vod_user_data.email,
    event_attendee_id: vod_user_data.event_attendee_id,
    userType: vod_user_data.userType.toLowerCase().trim(),
  },
  give_video_player_point(vimeoID, play_percent) {
    //activity, today, item, multiplier, points_arr, uid
    let activity = 'on_demand_video'
    let today = ''
    let item = vimeoID.toString()
    let multiplier = play_percent
    let points_arr = null
    let uid = firebase.auth().currentUser.uid
    let location = 'vod_library'
    try {
      nmrgames.give_points(activity, today, item, multiplier, points_arr, uid, location)
    } catch (error) {}
    // trigger_vod_animation(videoName);
  },

  build_analytics_obj(data) {
    if (data.play_percent == null || !data.url) {
      console.log('bad data passed to build analytics object: ', data)
      throw 'Bad data passed to build_analytics_obj'
    } else {
      return data
    }
  },
  get_index(target_arr, item) {
    const index = target_arr.findIndex((arr_item) => arr_item.id === item.id)
    return index
  },
  /**
   *
   * @param {Obj} data {
   *  iframe - an iframe dom element
   *  title - the title of the video
   *  id - the vimeo id of the video
   * }
   */
  setup_vimeo_player(data) {
    const iframe = data.iframe
    try {
      const player = new Vimeo.Player(iframe)
      const url = window.location.href
      const video_url = data.video_url
      const title = data.title
      this.setup_player_triggers(player, url, title, video_url)
    } catch (error) {
      throw new Error(error.message)
    }
  },
  setup_player_triggers(player, url, title, video_url) {
    this.first_play = true
    let self = this

    let build_analytics_hit = (play_percent) => {
      let new_hit = {
        url: url || '',
        title: title || '',
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        video_url: video_url || '',
        play_percent: play_percent || 0,
        ...this.user_data,
      }
      return new_hit
    }
    let process_player_event = (play_percent) => {
      let new_hit = this.build_analytics_obj(build_analytics_hit(play_percent))
      self.vod_logger(new_hit)
    }
    player.on('play', function () {
      if (self.first_play === true) {
        self.first_play = false
        console.log('first play: ')
        process_player_event(0)
      }
    })

    let playPercent = [false, false, false, false]
    player.on('timeupdate', function (event) {
      const current_play_percent = event.percent
      if (event.percent > 0.25 && playPercent[0] === false) {
        playPercent[0] = true
        console.log('user has played 25%')
        process_player_event(0.25)
      } else if (event.percent > 0.5 && playPercent[1] === false) {
        playPercent[1] = true
        console.log('user has played 50%')
        process_player_event(0.5)
      } else if (event.percent > 0.75 && playPercent[2] === false) {
        playPercent[2] = true
        console.log('user has played 75%')
        process_player_event(0.75)
        self.give_video_player_point(id, 1)
      } else if (event.percent == 1 && playPercent[2] === false) {
        playPercent[3] = true
        console.log('user has played 100%')
      }
    })

    player.on('ended', function (event) {
      console.log(' video has ended!')
      process_player_event(1)
    })
  },

  vod_logger(data, db) {
    console.log('hi,', this.analytics_location)
    let fb_key = this.analytics_location.replace(/[\.$\s]/g, '_')
    const vod_ref = db.ref('video_analytics/' + fb_key)
    const new_item = vod_ref.push()
    new_item
      .set(data)
      .then(() => {
        console.log('sent analytics: ', data)
      })
      .catch((error) => {
        console.error('error writing to analytics database')
      })
  },

  create_comma_seperated_arr(arr_as_string) {
    let new_arr = arr_as_string.split(',').map((item) => item.trim().toLowerCase())
    new_arr = new_arr.filter((item) => item != '')
    return new_arr
  },

  group_by(array_of_items_with_category_as_key, key) {
    let group_items = groupBy(array_of_items_with_category_as_key, (x) => x[key])
    return group_items
  },
  add_listener(db_ref, callback) {
    db_ref.on('value', function (snapshot) {
      let val = snapshot.val()
      if (callback) {
        try {
          callback(val)
        } catch (error) {
          console.log(error)
        }
      }
    })
  },
  keyify(new_key_name) {
    const copyKey = new_key_name.replace(/[.]/g, '_')
    return copyKey
  },
  truncate(text, length, clamp) {
    clamp = clamp || '...'
    var node = document.createElement('div')
    node.innerHTML = text
    var content = node.textContent
    return content.length > length ? content.slice(0, length) + clamp : content
  },
}
export default vod_utils
