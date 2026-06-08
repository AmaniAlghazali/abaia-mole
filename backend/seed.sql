-- Seed admin user (password: admin123 hashed with bcrypt)
INSERT INTO users (name, email, password, role)
VALUES (
    'Admin',
    'admin@abaia.com',
    '$2b$10$ILOc7nYz/69Vm5nYySy4n.GiVEKDzEiUvyacKM4F.3.4UPX0g9M.K',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Seed sample product
INSERT INTO products (title, description, price, size, color, fabric_type, quantity, title_en, description_en, fabric_type_en, color_en, style, style_en)
VALUES (
    'عباية كلاسيكية',
    'عباية كلاسيكية سوداء عالية الجودة',
    150.00,
    'M',
    'أسود',
    'حرير',
    10,
    'Classic Abaya',
    'High quality classic black abaya',
    'Silk',
    'Black',
    'كلاسيكي',
    'Classic'
) ON CONFLICT DO NOTHING;
