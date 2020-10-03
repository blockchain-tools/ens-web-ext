// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)
module.exports = {
  webpack: (config, { dev, vendor }) => {
    // Perform customizations to webpack config
    // Important: return the modified config
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    })

    // for  metamask-extension-provider
    config.node = {
      console: false, // boolean | "mock"
      global: true, // boolean | "mock"
      process: true, // boolean
      Buffer: true // boolean | "mock"
    }
    return config
  }
}
