# Real Estate Application

## Overview
This Real Estate Application is a modern web platform for listing and exploring properties such as land plots, rentals, villas, and apartments. Built with **Next.js**, **React**, and an **ASP.NET API**, it follows clean architecture principles to ensure scalability and maintainability.

---

## Architecture

The application is designed using a **feature-based architecture** combined with **clean architecture** principles. This ensures clear separation of concerns, modularity, and easy maintainability.

### Key Layers

1. **Presentation Layer**
   - Built using **Next.js** for server-side rendering and React for a dynamic front-end experience.
   - Routes are managed in the `src/app` folder, adhering to Next.js' routing conventions.

2. **Domain Layer**
   - Contains the core business logic, managed through reusable hooks and services in the `features` folder.

3. **Data Layer**
   - Manages API integration and data fetching using **ASP.NET API** as the backend.
   - API calls are centralized in `services` files for each feature.

---

## Folder Structure

```plaintext
src/
├── app/
│   ├── authentication/
│   │   ├── components/              # مكونات المصادقة (مثل تسجيل الدخول، التسجيل)
│   │   ├── hooks/                   # هوكس (مثل تسجيل الدخول، التحقق من الحالة)
│   │   ├── services/                # الخدمات (API أو تعاملات أخرى)
│   │   ├── types.ts                 # الأنواع المتعلقة بالمصادقة
│   │   ├── layout.tsx               # مكون layout للمصادقة (اختياري)
│   │   └── page.tsx                 # الصفحة التي تعرض واجهة المصادقة (مثل صفحة تسجيل الدخول)
│   ├── properties/
│   │   ├── components/              # مكونات العرض الخاصة بالعقارات
│   │   ├── services/                # خدمات العقارات (مثل البحث عن عقار أو عرض التفاصيل)
│   │   ├── hooks/                   # هوكس خاصة بالعقارات
│   │   ├── types.ts                 # الأنواع المتعلقة بالعقارات
│   │   ├── layout.tsx               # مكون layout الخاص بالعقارات
│   │   └── page.tsx                 # الصفحة التي تعرض قائمة العقارات
│   ├── interactive-map/
│   │   ├── components/              # مكونات الخريطة التفاعلية
│   │   ├── hooks/                   # هوكس خاصة بالخريطة
│   │   ├── services/                # خدمات الخريطة
│   │   ├── types.ts                 # الأنواع المتعلقة بالخريطة
│   │   ├── layout.tsx               # مكون layout الخاص بالخريطة
│   │   └── page.tsx                 # الصفحة التي تعرض الخريطة التفاعلية
│   ├── layout.tsx                   # Layout مشترك للموقع (مثال: الشريط الجانبي أو الرأس)
│   └── page.tsx                     # الصفحة الرئيسية (مثل الصفحة التي تحتوي على بيانات عامة أو صفحة الترحيب)
├── shared/
│   ├── components/                  # مكونات مشتركة بين جميع الصفحات
│   ├── hooks/                       # هوكس مشتركة يمكن استخدامها في جميع الأجزاء
│   ├── utils/                       # وظائف مساعدة يمكن استخدامها عبر التطبيق
│   ├── styles/                      # ملفات الأنماط المشتركة
│   ├── types/                       # الأنواع المشتركة بين جميع الصفحات
│   └── constants.ts                 # الثوابت المشتركة بين جميع أجزاء التطبيق
├── public/                          # الملفات الثابتة مثل الصور والفيديوهات
└── next.config.js                   # ملف إعدادات Next.js

```

---

## Routes

The application uses Next.js' file-based routing system. Below is an outline of the key routes:

### Public Routes
- `/` : Home page with an overview of the application.
- `/properties` : Displays a list of all properties.
- `/properties/[id]` : Detailed page for a single property.

### Authentication Routes
- `/login` : User login page.
- `/register` : User registration page.

### API Routes
- `/api/properties` : Fetch property listings.
- `/api/auth/login` : User login endpoint.
- `/api/auth/register` : User registration endpoint.

---

## Key Files

### `features/properties`

1. **`components/`**
   - `PropertyCard.tsx`: Renders individual property details like name, price, and location.
   - `PropertyFilter.tsx`: UI for filtering properties by criteria like price and location.

2. **`pages/`**
   - `listings.tsx`: Displays a list of properties, fetching data from `propertyService.ts`.

3. **`services/`**
   - `propertyService.ts`: Contains API logic for fetching property data.

4. **`hooks/`**
   - `useProperties.ts`: Custom hook for managing property state and logic.

5. **`types.ts`**
   - Defines TypeScript interfaces for property objects.

6. **`index.ts`**
   - Exports all components, hooks, and services for streamlined imports.

### `features/authentication`

1. **`components/`**
   - `LoginForm.tsx`: Form component for user login.
   - `RegisterForm.tsx`: Form component for user registration.

2. **`services/`**
   - `authService.ts`: Handles API calls for login and registration.

3. **`hooks/`**
   - `useAuth.ts`: Custom hook for managing authentication state.

### `shared`

1. **`components/`**
   - `Button.tsx`: Reusable button component.
   - `Modal.tsx`: Reusable modal component.

2. **`utils/`**
   - `apiClient.ts`: Axios instance for API calls.

3. **`constants.ts`**
   - Centralized constants such as API base URLs and other configurations.

---

## Installation

### Prerequisites
- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**
- **ASP.NET API** backend running

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/real-estate-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd real-estate-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following variables:
     ```env
     NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
     NEXT_PUBLIC_MAP_API_KEY=your-map-api-key
     ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b 
   ```
3. Commit your changes:
   ```bash
   git commit -m ""
   ```
4. Push to your branch:
   ```bash
   git push origin 
   ```
5. Create a pull request.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact
For any questions or support, please contact:
- **Email**: email@example.com
- **GitHub**: [ GitHub Profile](https://github.com/your-profile)
