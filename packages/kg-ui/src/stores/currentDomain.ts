import {createStore} from 'hox'
import {Domain} from 'kg-model'
import {useState} from 'react'

export const [useCurrentDomain, CurrentDomainProvider] = createStore(() => {
  // const [domainName, setDomainName] = useState<string | undefined>();
  const [domain, setDomian] = useState<Domain | undefined>()

  return {
    domainName: domain?.name,
    ...(domain || {}),
    updateDomain(_d: Domain) {
      setDomian(_d);
    }
  }
})
