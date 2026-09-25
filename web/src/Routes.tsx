import { Router, Route, Set } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'
import StoryLayout from 'src/layouts/StoryLayout/StoryLayout'

// You need to import the pages here!
import AboutPage from 'src/pages/AboutPage/AboutPage'
import ContactPage from 'src/pages/ContactPage/ContactPage'
import HomePage from 'src/pages/HomePage/HomePage'
import HowItWorksPage from 'src/pages/HowItWorksPage/HowItWorksPage'
import NotFoundPage from 'src/pages/NotFoundPage/NotFoundPage'

// Layouts live inside the Router so their navigation can use named routes.
const Routes = () => {
  return (
    <Router>
      <Set wrap={StoryLayout}>
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Set wrap={MainLayout}>
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/how-it-works" page={HowItWorksPage} name="howItWorks" />
        <Route path="/contact" page={ContactPage} name="contact" />
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes
