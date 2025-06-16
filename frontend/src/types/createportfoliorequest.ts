import Holdings from './holdings'

interface CreatePortfolioRequest {
  name: string
  holdings: Holdings[]
}

export default CreatePortfolioRequest
