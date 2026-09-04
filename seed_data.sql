-- Seed Data for AgriMart (Demo purposes)

-- Insert Categories
INSERT INTO crop_categories (name, description) VALUES
('Vegetables', 'Fresh daily vegetables'),
('Fruits', 'Seasonal fruits'),
('Cereals', 'Grains and cereals')
ON CONFLICT (name) DO NOTHING;

-- Insert Crops (Assuming categories were just inserted and we look them up)
DO $$ 
DECLARE 
    veg_id UUID;
    fruit_id UUID;
    cereal_id UUID;
BEGIN
    SELECT id INTO veg_id FROM crop_categories WHERE name = 'Vegetables';
    SELECT id INTO fruit_id FROM crop_categories WHERE name = 'Fruits';
    SELECT id INTO cereal_id FROM crop_categories WHERE name = 'Cereals';

    INSERT INTO crops (category_id, name, variety, default_unit) VALUES
    (veg_id, 'Tomato', 'Hybrid', 'kg'),
    (veg_id, 'Onion', 'Red', 'kg'),
    (veg_id, 'Potato', 'Regular', 'kg'),
    (fruit_id, 'Mango', 'Alphonso', 'kg'),
    (cereal_id, 'Rice', 'Basmati', 'quintal'),
    (cereal_id, 'Wheat', 'Lokwan', 'quintal')
    ON CONFLICT DO NOTHING;
END $$;

-- Notice: Market price data will need real crop_id references, which are UUIDs generated above. 
-- For a quick demo, market intelligence will use dynamic defaults if no exact match is found.
