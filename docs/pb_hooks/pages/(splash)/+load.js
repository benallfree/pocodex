module.exports = () => {
  return {
    favorited: {},
    plugins: [
      {
        description: 'Server-side JS pages for PocketBase',
        npm_name: 'pocketpages',
        github_name: 'benallfree/pocketpages',
      },
      {
        npm_name: 'pocketbase-otp',
        description: 'One Time Password API for PocketBase',
        github_name: 'benallfree/pocketbase-otp',
      },
    ],
  }
}
