import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes, Route, useLocation, Navigate } from "react-router";
import { useNotification } from './components/notifier/NotificationProvider'

import Login from './pages/login/Login'
import About from './pages/about/About'
import Home from './pages/home/Home'

import { NotificationType, RoutePaths } from './Constants';
import File from './pages/file/File'
import NotFound from './pages/notFound/NotFound'
import PublicRoute from './components/mainRoutes/PublicRoute'
import ProtectedRoute from './components/mainRoutes/ProtectedRoute'
import { useAuth, useAuthRef } from './components/Authentication/AuthProvider'
import ExchangeDetails from './pages/file/exchangeDetails/ExchangeDetails'
import ExchangesList from './pages/file/exchangesList/ExchangesList'

export default function App() {
  
	/**
	 * It's like a tree. 
	 * The call check the leaves which group matches the target location -> 
	 * Then execute the path of internal nodes (outstanding routes like public routes)
	 */


	const notify = useNotification();
	const isAuthenticatedRef = useAuthRef();
	return (
		<Routes>
			{/* Default route */}
			<Route
				path="/"
				element={
					<Navigate
						to={isAuthenticatedRef.current ? RoutePaths.HOME : RoutePaths.LOGIN}
						replace
					/>
				}
			/>

			{/* Public routes */}
			<Route path={RoutePaths.LOGIN} element={<Login />} />
			<Route path={RoutePaths.ABOUT} element={<About />} />
			
			{/* Protected routes */}
			<Route element={<ProtectedRoute notify={notify} />}>
				<Route path={`${RoutePaths.FILE}/:fileNumber`} element={<File />} >
					<Route
						index
						element={<ExchangesList />}
					/>

					<Route
						path="exchange/:exchangeId"
						element={<ExchangeDetails />}
					/>
				</Route>
				<Route path={RoutePaths.HOME} element={<Home />} />
			</Route>

			{/* 404 */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	)
}
