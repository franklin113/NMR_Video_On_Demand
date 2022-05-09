import { shallowMount } from '@vue/test-utils'
import SpeakerSection from '@/components/SpeakerSection'

describe('speaker section', () => {
  test('it does not crash', () => {
    const wrapper = shallowMount(SpeakerSection, {
      propsData: {
        speakers: {
          speaker1: {
            username: 'Tim Franklin',
          },
          speaker2: {
            username: 'James Wilkes',
          },
        },
        directoryId: '123',
      },
    })
    const items = wrapper.findAll('.single-speaker')
    expect(items.at(1).text()).toBe('Tim Franklin')
  })
  test('it does not crash', () => {
    const wrapper = shallowMount(SpeakerSection, {
      propsData: {
        speakers: null,
        directoryId: null,
      },
    })
    const items = wrapper.findAll('.single-speaker')
    expect(wrapper.find('#speakers-component').exists()).toBe(true)
    expect(items.length).toBe(0)
  })
})
