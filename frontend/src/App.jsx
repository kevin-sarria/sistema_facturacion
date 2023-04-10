import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { Provider } from 'react-redux';
import { store } from './store';

export const App = () => {

  return (
    <div className="min-w-screen min-h-screen">

      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </Provider>

    </div>
  )
}