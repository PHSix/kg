import { extendOption } from './request'
import { describe, it, expect } from 'vitest'


describe('request test case', () => {
  it('test option extend with a method',() => {
    expect(extendOption({method: "POST"}).method).toEqual(
       "POST"
    )
  })

  it('test change content type', () => {
    expect(extendOption({header: {
      "Content-Type": "application/x-www-form-urlencoded"
    }}).header["Content-Type"]).toEqual(
       "application/x-www-form-urlencoded"
    )
  })

  it('test add header', () => {
    expect(extendOption({header: {
      "Last-Modified": "Today"
    }}).header["Last-Modified"]).toEqual(
       "Today"
    )
  })
})



