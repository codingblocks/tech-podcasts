const path = require(`path`)

exports.onCreateNode = ({ node, actions }) => {
  if (node.internal.type === `PodcastShow`) {
    console.log(`slug: ${node.slug}`)
    actions.createPage({
      path: `/shows/${node.slug}/`,
      component: path.resolve(`./src/templates/podcast-show.js`),
      context: node
    })
  }

  let earliestDate = new Date()
  earliestDate = earliestDate.setDate(earliestDate.getDate() - 90)
  const formatDate = d => {
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return `${year}${month}${day}`
  }

  exports.onPreExtractQueries = ({ actions }) => {
    console.log(`Creating pages by date range`)
    const today = new Date()
    let endDate = new Date()
    endDate.setDate(today.getDate() - today.getDay())
    let startDate = new Date()
    startDate.setDate(endDate.getDate() - 7)

    while (startDate > earliestDate) {
      const slug = `/episodes/for-week/${formatDate(startDate)}-${formatDate(endDate)}/`
      console.log(`Created page for ${slug}`)
      actions.createPage({
        path: slug,
        component: path.resolve(`./src/templates/episodes-for-week.js`),
        context: {
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        }
      })
      startDate.setDate(startDate.getDate() - 7)
      endDate.setDate(endDate.getDate() - 7)
    }
  }
}
