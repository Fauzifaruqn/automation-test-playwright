export const AppSelectors = {
    // Navigation
    navigation: {
        logo: 'img[alt="Logo"]',
        loginLink: 'a[href="/"]',
        registerLink: 'a[href="/register"]',
        ordersLink: 'a[href="/orders"]',
        logoutButton: 'button:has-text("Logout")'
    },

    // Login Page
    login: {
        usernameInput: 'input[placeholder="Username"]',
        passwordInput: 'input[placeholder="Password"]',
        loginButton: 'button:has-text("Login")',
        heading: 'h2:has-text("Login")',

        // Login validation errors
        loginError: '.error-message, .alert-error, text="Invalid credentials"',
        invalidCredentialsError: 'text=Invalid credentials',
        emptyFieldsError: '.error, small.error'
    },

    // Register Page
    register: {
        usernameInput: 'input[placeholder="Enter your username"]',
        passwordInput: 'input[placeholder="Enter your password"]',
        registerButton: 'button:has-text("Register")',
        heading: 'h2:has-text("Create Account")',
        loginLink: 'text=Login',

        // Register validation errors
        usernameExistsError: 'text=Username already exists',
        registrationError: '.error-message, .alert-error'
    },

    // Orders Page
    orders: {
        // Form fields
        itemInput: 'input[name="item"]',
        deliveryAddressInput: 'input[name="deliveryAddress"]',
        quantityInput: 'input[name="quantity"]',
        phoneInput: 'input[name="phone"]',
        notesInput: 'textarea[name="notes"]',
        imageUpload: 'input[type="file"]',
        termsCheckbox: 'input[type="checkbox"]',

        // Buttons
        createOrderButton: 'button:has-text("Create Order")',
        updateOrderButton: 'button:has-text("Update Order")',

        // Headings
        createOrderHeading: 'h2:has-text("Create Order")',
        editOrderHeading: 'h2:has-text("Edit Order")',
        ordersListHeading: 'h3:has-text("Your Orders")',

        // Order list
        ordersList: 'ul.order-list',
        orderItem: 'li.order-card',
        editButton: 'button:has-text("Edit")',
        deleteButton: 'button:has-text("Delete")',

        // Delete confirmation
        deleteConfirmation: 'text=Are you sure you want to delete this order?',
        confirmDeleteButton: 'button:has-text("Yes, Delete")',
        cancelDeleteButton: 'button:has-text("Cancel")',

        // Validation errors - specific error messages
        validationErrors: {
            itemRequired: 'text=Item is required',
            addressRequired: 'text=Address is required',
            quantityInvalid: 'text=Quantity must be a positive number',
            phoneInvalid: 'text=Phone must be 10-15 digits',
            imageRequired: 'text=Image is required',
            termsRequired: 'text=You must accept the terms',

            // Generic error selectors
            anyError: '.error, small.error',
            formErrors: '.form-errors',
            fieldError: '[class*="error"]'
        },

        // Success messages
        successMessages: {
            orderCreated: 'text=Order created successfully',
            orderUpdated: 'text=Order updated successfully',
            orderDeleted: 'text=Order deleted successfully'
        }
    }
} as const;

// Validation error messages as constants for reusability
export const ValidationMessages = {
    orders: {
        itemRequired: 'Item is required',
        addressRequired: 'Address is required',
        quantityInvalid: 'Quantity must be a positive number',
        phoneInvalid: 'Phone must be 10-15 digits',
        imageRequired: 'Image is required',
        termsRequired: 'You must accept the terms'
    },
    auth: {
        invalidCredentials: 'Invalid credentials',
        usernameExists: 'Username already exists',
        userRegistered: 'User registered'
    }
} as const;