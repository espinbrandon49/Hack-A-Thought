// root/server/seed.js
const sequelize = require('./config/connection');
const { User, Blog, Comment } = require('./models');

async function seed() {
    try {
        await sequelize.sync({ force: true });

        // --- USERS ---
        const userData = [
            { name: 'Brandon Espinosa', username: 'b_espinosa', password: 'password123' },
            { name: 'Marcus Hale', username: 'marcus_hale', password: 'password123' },
            { name: 'Elena Ruiz', username: 'elena_ruiz', password: 'password123' },
            { name: 'Derek Vaughn', username: 'derek_vaughn', password: 'password123' },
        ];

        const users = await User.bulkCreate(userData, {
            individualHooks: true,
            validate: true,
        });

        // --- BLOGS ---
        const blogData = [
            {
                title: 'Why consistency beats intensity every time',
                content: 'Most people burn out because they go too hard too fast. Showing up daily, even at 60%, compounds harder than rare 100% efforts.',
                user_id: users[0].id,
            },
            {
                title: 'What I learned from failing my first coding project',
                content: 'I didn’t fail because I couldn’t code. I failed because I didn’t plan. Architecture matters more than effort.',
                user_id: users[1].id,
            },
            {
                title: 'Stop overcomplicating your tech stack',
                content: 'You don’t need 10 libraries. You need clarity, structure, and consistency. Simplicity scales better than cleverness.',
                user_id: users[2].id,
            },
            {
                title: 'The difference between motion and progress',
                content: 'Being busy feels productive, but only deliberate work moves the needle. Most of us hide in motion to avoid real progress.',
                user_id: users[0].id,
            },
        ];

        const blogs = await Blog.bulkCreate(blogData, { validate: true });

        // --- COMMENTS ---
        const commentData = [
            {
                comment: 'This hit. I always start strong and fall off after a week.',
                blog_id: blogs[0].id,
                user_id: users[2].id,
            },
            {
                comment: 'Same here. I started tracking daily habits and that changed everything.',
                blog_id: blogs[0].id,
                user_id: users[3].id,
            },
            {
                comment: 'Tracking is underrated. Makes it real.',
                blog_id: blogs[0].id,
                user_id: users[0].id,
            },
            {
                comment: 'Planning is the hardest part. Everyone skips it.',
                blog_id: blogs[1].id,
                user_id: users[0].id,
            },
            {
                comment: 'Agreed. I used to jump straight into coding and regret it every time.',
                blog_id: blogs[1].id,
                user_id: users[2].id,
            },
            {
                comment: 'This is why I stick to React + Express. No need to overengineer.',
                blog_id: blogs[2].id,
                user_id: users[1].id,
            },
            {
                comment: 'People chase trends instead of solving problems.',
                blog_id: blogs[2].id,
                user_id: users[3].id,
            },
            {
                comment: '“Motion vs progress” is real. I needed this reminder.',
                blog_id: blogs[3].id,
                user_id: users[1].id,
            },
            {
                comment: 'I’ve been busy all week and accomplished nothing meaningful.',
                blog_id: blogs[3].id,
                user_id: users[2].id,
            },
        ];

        await Comment.bulkCreate(commentData, { validate: true });

        console.log('✅ Seed complete');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    }
}

seed();