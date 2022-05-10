import { shallowMount } from '@vue/test-utils'
import SpeakerSection from '@/components/SpeakerSection'

describe('speaker section', () => {
  test('it does not crash', () => {
    const wrapper = shallowMount(SpeakerSection, {
      propsData: {
        speakers: {
          speaker1: {
            first_name: 'tim',
            last_name: 'franklin',
          },
          speaker2: {
            first_name: 'james',
            last_name: 'wilkes',
          },
        },
        directoryId: '123',
        libraryId: '123',
      },
    })
    const items = wrapper.findAll('.single-speaker')
    expect(items.at(0).text()).toBe('Tim Franklin')
  })
  test('it does not crash', () => {
    const wrapper = shallowMount(SpeakerSection, {
      propsData: {
        speakers: null,
        directoryId: null,
        libraryId: '123',
      },
    })
    const items = wrapper.findAll('.single-speaker')
    expect(wrapper.find('.speakers-component').exists()).toBe(true)
    expect(items.length).toBe(0)
  })
})
