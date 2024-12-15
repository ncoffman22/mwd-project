## **Change Log**

**0.6.2 - 2024-12-14**
**EDITED**
- Fixed and reduced component structure down to current version
- Transferred all data processing to cache
- Fixed all warnings and errors

**0.6.1 - 2024-12-10**
**ADDED**
- Cache service
  - cacheService.js
- User Profile
  - AccountContainer.js
  - AccountEdit.js
  - AccountDisplay.js
  - AccountPicture.js

**O.6 - 2024-12-8**
**ADDED**
- Wiki component
  - WikiContainer.js
  - WikiParent.js
  - LiftTypeList.js
  - SearchBar.js
  - SplitCard.js
  - SplitList.js
- Calendar component
  - CalendarContainer.js
  - CalendarParent.js
  - CalendarChild.js
  - DateCellRender.js
  - WeekView.js
- Statistics components
  - AdvancedStatisticsParent.js
  - AdvancedStatisticsChild.js
  - AdvancedStatisticsComponent.js
  - StatisticsParent.js
  - StatisticsChild.js
  - StatisticsComponent.js
- WorkoutDetail component
  - WorkoutDetailComponent.js
  - WorkoutDetailParent.js
  - ActiveWorkoutView.js
  - LiftCard.js
  - ProgressSection.js
  - CompletedWorkoutView.js
  - ExerciseResult.js
  - SummarySection.js
- Services for AI generated workouts and AI description
  - openAIService.js
  - workoutDescription.js
- Service for statistics
  - statisticsService.js


**0.5 - 2024-11-08**
**ADDED**

- Components.js
- ProtectedRoutes.js

**0.4.1 - 2024-10-17**

**ADDED**

- services/splitService.js

**0.4.0 - 2024-10-09**

**ADDED**

- Created React App
- components
  - AddWorkout
    - AddWorkoutChild.js
    - AddWorkoutContainer.js
    - AddWorkoutParent.js
  - Auth
    - AuthChild.js
    - AuthContainer.js
    - AuthParent.js
  - Dashboard
    - DashboardChild.js
    - DashboardContainer.js
    - DashboardParent.js
  - Navigation
    - NavigationContainer.js
    - NavigationParent.js
  - Workouts
    - WorkoutsChild.js
    - WorkoutsContainer.js
    - WorkoutsParent.js
- services
  - authService.js
  - workoutService.js
