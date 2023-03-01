import {createStore} from 'hox'
import {DomainType} from 'kg-model'
import {useState} from 'react'

export const [useCurrentDomain, CurrentDomainProvider] = createStore(() => {
  // const [domainName, setDomainName] = useState<string | undefined>();
  const [domain, setDomian] = useState<DomainType | undefined>()

  return {
    domainName: domain?.name,
    ...(domain || {}),
    updateDomain(_d: DomainType) {
      setDomian(_d);
    }
  }
})
