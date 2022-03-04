import React ,{Component, useContext} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authContext } from '../ContextApi/ContextApi';

const PrivateRoute = ({children}) => {

    const {user} = useContext(authContext)

    let location = useLocation();

    if (!user) {

        return <Navigate to="/login" state={{ from: location }} replace />;
      }

    return children
};

export default PrivateRoute;