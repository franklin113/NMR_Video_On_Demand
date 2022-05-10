import { shallowMount } from '@vue/test-utils'
import AssetsSection from '@/components/AssetSection'

describe.skip('assets section', () => {
  test('it does not crash', () => {
    const wrapper = shallowMount(AssetsSection, {
      propsData: {
        assets: {
          item1: {
            title: 'test1',
            url: 'https://www.google.com',
          },
          item2: {
            title: 'test2',
            url: 'https://www.google.com',
          },
        },
      },
    })
    const items = wrapper.findAll('.single-asset-div')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toBe('test1')
    expect(items.at(1).text()).toBe('test2')
  })
  test('it does not crash', () => {
    const wrapper = shallowMount(AssetsSection, {
      propsData: {
        assets: {
          item1: {
            title: 'test1',
            url: 'https://www.google.com',
            idx: 1,
          },
          item2: {
            title: 'test2',
            url: 'https://www.google.com',
            idx: 0,
          },
        },
      },
    })
    const items = wrapper.findAll('.single-asset-div')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toBe('test2')
    expect(items.at(1).text()).toBe('test1')
  })
  test('it does not crash', () => {
    const wrapper = shallowMount(AssetsSection, {
      propsData: {
        assets: {
          item1: {
            title: 'test1',
            url: 'https://www.google.com',
            idx: 1,
          },
          item2: {
            title: 'test2',
            url: 'https://www.google.com',
            idx: 0,
          },
        },
      },
    })
    const items = wrapper.findAll('.single-asset-div')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toBe('test2')
    expect(items.at(1).text()).toBe('test1')
  })
  test('it does not crash', () => {
    const wrapper = shallowMount(AssetsSection, {
      propsData: {
        assets: null,
      },
    })
    const items = wrapper.findAll('.single-asset-div')
    expect(items.length).toBe(0)
  })
})
