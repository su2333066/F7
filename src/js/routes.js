import HomePage from '../pages/home.jsx';
import LoginPage from '../pages/login.jsx';
import JoinPage from '../pages/join.jsx';
import MatchPage from '../pages/match.jsx';
import DetailPage from '../pages/detail.jsx';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/login/',
    component: LoginPage,
  },
  {
    path: '/join/',
    component: JoinPage,
  },
  {
    path: '/match/',
    component: MatchPage,
  },
  {
    path: '/match/:seq/',
    component: MatchPage,
  },
  {
    path: '/detail/:seq/',
    component: DetailPage,
  },
];

export default routes;
