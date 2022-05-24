<template>
  <div id="tag-component">
    <div id="tag-wrapper">
      <transition name="fade">
        <div v-if="allTags.length > 0" id="alpha-select">
          <a
            v-for="(letter, index) in letters"
            :key="index"
            :class="[selectedLetter === letter ? 'active' : '']"
            class="single-alpha-select"
          >
            <input
              :id="'letter-' + letter"
              v-model="selectedLetter"
              class="letter-input"
              type="radio"
              :value="letter"
              style="display: none"
            />
            <label :for="'letter-' + letter" class="single-alpha-letter"
              ><span class="letter-text">{{ letter }}</span>
              <span v-show="lettersThatHaveTags.has(letter)" class="has-selection">
                <i class="has-selection-icon fas fa-circle"></i>
              </span>
            </label>
          </a>
        </div>
      </transition>
      <transition-group id="tag-selector" name="list-complete" tag="div">
        <a
          v-for="(tag, index) in activeTags"
          :key="tag"
          class="single-tag-a list-complete-item"
          :class="[selectedTags.includes(tag) ? 'active' : '']"
        >
          <input
            :id="'tag-' + index.toString()"
            v-model="selectedTags"
            type="checkbox"
            :value="tag"
            style="display: none"
            @change="$emit('selected-tags-changed', selectedTags)"
          />
          <label class="single-tag" :for="'tag-' + index.toString()"
            ><span class="single-tag-text">{{ tag }}</span></label
          >
        </a>
        <a
          v-if="selectedTags.length > 0"
          key="clear"
          class="clear-tags single-tag-a list-complete-item"
          @click="clearTags"
        >
          <label class="single-tag"><span class="single-tag-text">Clear All</span></label>
        </a>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    vodItems: {
      type: Array,
      required: true,
    },
    tagsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedTags: [],
      selectedLetter: '',
      // letters: [
      //   'a',
      //   'b',
      //   'c',
      //   'd',
      //   'e',
      //   'f',
      //   'g',
      //   'h',
      //   'i',
      //   'j',
      //   'k',
      //   'l',
      //   'm',
      //   'n',
      //   'o',
      //   'p',
      //   'q',
      //   'r',
      //   's',
      //   't',
      //   'u',
      //   'v',
      //   'w',
      //   'x',
      //   'y',
      //   'z',
      // ],
    }
  },
  computed: {
    letters() {
      const letterSet = new Set([])

      this.allTags.forEach((item) => letterSet.add(item[0]))
      return Array.from(letterSet).sort()
    },
    allTags() {
      const tagSet = new Set([])
      for (let i of this.vodItems) {
        if (!i.tags) {
          continue
        }

        Object.keys(i.tags).forEach((item) => {
          const decodedTag = decodeURIComponent(item)
          tagSet.add(decodedTag)
        })
      }
      return Array.from(tagSet)
    },
    activeTags() {
      return this.allTags.filter((i) => i && i.toLowerCase().trim()[0] === this.selectedLetter)
    },
    lettersThatHaveTags() {
      const letterSet = new Set([])

      this.selectedTags.forEach((item) => letterSet.add(item[0]))

      return letterSet
    },
  },
  methods: {
    clearTags() {
      this.selectedTags = []
    },
  },
}
</script>

<style  scoped>
div#alpha-select {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.single-alpha-select .single-alpha-letter,
.single-tag-a .single-tag {
  padding: 1em;
  transition: all 0.3s;
}
.single-alpha-select.active .single-alpha-letter,
.single-tag-a.active .single-tag {
  padding: 1em;
  background-color: rgb(56, 49, 98);
  color: #fff;
}
#tag-selector {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 1000px;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
}
.single-tag {
  padding: 1em;
}
.single-tag-text,
.letter-text {
  text-transform: capitalize;
}

.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
.has-selection-icon.fas.fa-circle {
  font-size: 8px;
  vertical-align: text-top;
}
.has-selection {
  margin-left: 3px;
}

.clear-tags.single-tag-a.list-complete-item:active label {
  background-color: rgb(56, 49, 98);
  color: #fff;
}

/* we will explain what these classes do next! */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>