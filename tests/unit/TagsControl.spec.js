import { shallowMount } from '@vue/test-utils'
import TagsControl from '@/components/TagsControl'

describe('tags control', () => {
  test('it shows correct stuff', async () => {
    const wrapper = shallowMount(TagsControl, {
      propsData: {
        vodItems: [
          {
            tags: {
              a: true,
              b: true,
            },
          },
          {
            tags: {
              c: true,
              d: true,
            },
          },
        ],
      },
    })
    const items = wrapper.findAll('.single-alpha-letter')
    expect(items.length).toBe(4)
    await items.at(0).trigger('click')
    const tags = wrapper.findAll('.single-tag')
    await tags.at(0).trigger('click')
    expect(wrapper.vm.selectedTags).toEqual(['a'])
  })

  test('handles bad data', async () => {
    const wrapper = shallowMount(TagsControl, {
      propsData: {
        vodItems: [
          {},
          {
            tags: {
              c: true,
              d: true,
            },
          },
        ],
      },
    })
    const items = wrapper.findAll('.single-alpha-letter')
    expect(items.length).toBe(2)
  })

  test('handles no data', async () => {
    const wrapper = shallowMount(TagsControl, {
      propsData: {
        vodItems: [],
      },
    })
    const items = wrapper.findAll('.single-alpha-letter')
    expect(items.length).toBe(0)
  })
})
