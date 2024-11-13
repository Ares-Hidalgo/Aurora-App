CREATE DATABASE IF NOT EXISTS Aurora;

USE Aurora;

-- Tabla de Inventario
CREATE TABLE IF NOT EXISTS Inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(50),
    alertLevel INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Orders
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    deliveryAddress VARCHAR(255),
    tableNumber INT,
    orderMode ENUM('dine-in', 'delivery') NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tip DECIMAL(10, 2),
    taxes DECIMAL(10, 2),
    discount DECIMAL(10, 2),
    total DECIMAL(10, 2) NOT NULL,
    paymentMethod ENUM('cash', 'card') NOT NULL,
    paymentStatus ENUM('pending', 'paid') NOT NULL,
    status ENUM('pending', 'completed') DEFAULT 'pending'
);

-- Tabla Sales
CREATE TABLE IF NOT EXISTS Sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    customerName VARCHAR(255) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    paymentMethod ENUM('cash', 'card') NOT NULL,
    saleDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE
);

-- Tabla Users
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    document VARCHAR(255),
    rol ENUM('client', 'admin') DEFAULT 'client',
    pass VARCHAR(255) NOT NULL
);

-- Tabla Menu
CREATE TABLE IF NOT EXISTS Menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE
);

-- Tabla OrderItems
CREATE TABLE IF NOT EXISTS OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    menuItemId INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menuItemId) REFERENCES Menu(id) ON DELETE CASCADE
);

-- Inserts para la tabla Inventory
INSERT INTO Inventory (name, quantity, unit, alertLevel) VALUES
('Tomatoes', 100, 'kg', 10),
('Onions', 50, 'kg', 5),
('Cheese', 20, 'kg', 2),
('Bread', 200, 'pieces', 20),
('Milk', 30, 'liters', 5),
('Eggs', 300, 'pieces', 30),
('Butter', 15, 'kg', 3),
('Chicken', 50, 'kg', 5),
('Beef', 40, 'kg', 4),
('Fish', 25, 'kg', 2);

-- Inserts para la tabla Orders
INSERT INTO Orders (customerName, contact, deliveryAddress, tableNumber, orderMode, subtotal, tip, taxes, discount, total, paymentMethod, paymentStatus, status) VALUES
('John Doe', '123456789', '123 Elm St', 1, 'dine-in', 50.00, 5.00, 3.00, 0.00, 58.00, 'card', 'paid', 'completed'),
('Jane Smith', '987654321', '456 Oak St', 2, 'delivery', 30.00, 3.00, 2.00, 0.00, 35.00, 'cash', 'pending', 'pending'),
('Alice Johnson', '555555555', '789 Pine St', 3, 'dine-in', 20.00, 2.00, 1.50, 0.00, 23.50, 'card', 'paid', 'completed'),
('Bob Brown', '444444444', '321 Maple St', 4, 'delivery', 40.00, 4.00, 2.50, 0.00, 46.50, 'cash', 'paid', 'completed'),
('Charlie Black', '333333333', '654 Birch St', 5, 'dine-in', 60.00, 6.00, 3.50, 0.00, 69.50, 'card', 'pending', 'pending'),
('Diana White', '222222222', '987 Cedar St', 6, 'delivery', 25.00, 2.50, 1.75, 0.00, 29.25, 'cash', 'paid', 'completed'),
('Eve Green', '111111111', '159 Spruce St', 7, 'dine-in', 35.00, 3.50, 2.25, 0.00, 40.75, 'card', 'paid', 'completed'),
('Frank Blue', '666666666', '753 Willow St', 8, 'delivery', 45.00, 4.50, 2.75, 0.00, 52.25, 'cash', 'pending', 'pending'),
('Grace Red', '777777777', '852 Fir St', 9, 'dine-in', 55.00, 5.50, 3.25, 0.00, 63.75, 'card', 'paid', 'completed'),
('Hank Yellow', '888888888', '951 Ash St', 10, 'delivery', 65.00, 6.50, 3.75, 0.00, 75.25, 'cash', 'paid', 'completed');

-- Inserts para la tabla Sales
INSERT INTO Sales (orderId, customerName, total, paymentMethod) VALUES
(1, 'John Doe', 58.00, 'card'),
(2, 'Jane Smith', 35.00, 'cash'),
(3, 'Alice Johnson', 23.50, 'card'),
(4, 'Bob Brown', 46.50, 'cash'),
(5, 'Charlie Black', 69.50, 'card'),
(6, 'Diana White', 29.25, 'cash'),
(7, 'Eve Green', 40.75, 'card'),
(8, 'Frank Blue', 52.25, 'cash'),
(9, 'Grace Red', 63.75, 'card'),
(10, 'Hank Yellow', 75.25, 'cash');

-- Inserts para la tabla Users
INSERT INTO Users (name, email, document, password, rol) VALUES
('John Doe', 'jdoe@example.com', '123456789', 'password123', 'client'),
('Jane Smith', 'jsmith@example.com', '987654321', 'password123', 'admin'),
('Alice Johnson', 'ajohnson@example.com', '555555555', 'password123', 'client'),
('Bob Brown', 'bbrown@example.com', '444444444', 'password123', 'client'),
('Charlie Black', 'cblack@example.com', '333333333', 'password123', 'admin'),
('Diana White', 'dwhite@example.com', '222222222', 'password123', 'client'),
('Eve Green', 'egreen@example.com', '111111111', 'password123', 'client'),
('Frank Blue', 'fblue@example.com', '666666666', 'password123', 'admin'),
('Grace Red', 'gred@example.com', '777777777', 'password123', 'client'),
('Hank Yellow', 'hyellow@example.com', '888888888', 'password123', 'client');

-- Inserts para la tabla Menu
INSERT INTO Menu (name, description, price, available) VALUES
('Margherita Pizza', 'Classic pizza with tomato sauce and cheese', 8.99, TRUE),
('Pepperoni Pizza', 'Pizza with pepperoni slices', 9.99, TRUE),
('Veggie Pizza', 'Pizza with assorted vegetables', 10.99, TRUE),
('BBQ Chicken Pizza', 'Pizza with BBQ chicken and onions', 11.99, TRUE),
('Hawaiian Pizza', 'Pizza with ham and pineapple', 9.99, TRUE),
('Cheeseburger', 'Burger with cheese, lettuce, and tomato', 7.99, TRUE),
('Chicken Sandwich', 'Grilled chicken sandwich with lettuce', 6.99, TRUE),
('Caesar Salad', 'Salad with romaine lettuce and Caesar dressing', 5.99, TRUE),
('Spaghetti Bolognese', 'Pasta with meat sauce', 12.99, TRUE),
('Tiramisu', 'Classic Italian dessert', 4.99, TRUE),
('Hamburguesa Clásica', 'Jugosa hamburguesa con lechuga, tomate y queso cheddar', 8.99, TRUE),
('Pizza Margherita', 'Pizza con salsa de tomate, mozzarella y albahaca fresca', 10.99, TRUE),
('Ensalada César', 'Ensalada con lechuga romana, crutones y aderezo César', 7.49, TRUE),
('Tacos de Pollo', 'Tacos rellenos de pollo sazonado, cebolla y cilantro', 6.99, TRUE),
('Sopa de Tomate', 'Sopa cremosa de tomate con albahaca', 4.99, TRUE),
('Pasta Alfredo', 'Pasta con salsa Alfredo cremosa y queso parmesano', 11.99, TRUE),
('Sándwich de Atún', 'Sándwich de atún con mayonesa y lechuga', 5.99, TRUE),
('Batido de Fresa', 'Batido de fresa fresco y cremoso', 3.99, TRUE),
('Brownie de Chocolate', 'Brownie de chocolate con nueces', 2.99, TRUE),
('Café Americano', 'Café negro fuerte y aromático', 2.49, TRUE);