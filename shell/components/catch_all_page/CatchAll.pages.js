/* eslint-disable import/prefer-default-export */
export const TYPE_404 = 'Page404'
export Page404 from './Page404'

// Components
// * Stateless components when possible
// * No shouldComponentUpdate with PureComponent
// * propTypes and defaultProps

// Redux
// * always use selectors
// * look for existing selectors to compose in createSelector

// Testing
// * no mount, shallow only (mount should be for integration tests and should be run separatly)
// * export and unit test all pure functions
// * write fail case tests
// * write tests to make sure there is no mutation when working with data
