import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'

export default ({ data, pageContext }) => {
  const startDate = new Date(pageContext.startDate)
  const endDate = new Date(pageContext.endDate)

  let episodes = []
  let seenEpisodes = {}
  data.allPodcastShow.edges.forEach(n => {
    n.node.episodes.forEach(e => {
      if (seenEpisodes[e.audioUrl]) {
        console.log(`{e.audioUrl} seen, skipping!`)
        return
      }
      seenEpisodes[e.audioUrl] = true
      e.published = new Date(e.published)
      e.slug = n.node.slug
      if (e.published >= startDate && e.published <= endDate) {
        episodes.push(e)
      } else {
        if (e.podcastTitle === 'Coding Blocks') {
          console.log(`Skipping ${e.podcastTitle} ${e.published}`)
        }
      }
    })
  })
  episodes.sort((a, b) => b.published - a.published)

  const previousStart = new Date(startDate)
  const previousEnd = new Date(endDate)
  previousStart.setDate(previousStart.getDate() - 7)
  previousEnd.setDate(previousEnd.getDate() - 7)

  const previousSlug = `/episodes/for-week/${formatDate(previousStart)}-${formatDate(previousEnd)}/`
  const hidePreviousLink = startDate <= earliestDate

  return (
    <Layout>
      <div>
        <p>{episodes.length} podcasts released between {startDate.toLocaleDateString()} and {endDate.toLocaleDateString()}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Episode Name</th>
            <th>Podcast Show</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map(e => (
            <tr key={e.audioUrl}>
              <td>
                <a href={e.audioUrl} title={`Listen to e.{podcastTitle}`}>{e.episodeTitle}</a>
              </td>
              <td>
                <Link to={`/shows/${e.slug}`}>{e.podcastTitle}</Link>
              </td>
              <td>{e.published.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to={previousSlug} hidden={hidePreviousLink}>Previous week</Link>
    </Layout>
  )
}

let earliestDate = new Date()
earliestDate = earliestDate.setDate(earliestDate.getDate() - 90)
const formatDate = d => {
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

export const query = graphql`
  query {
    allPodcastShow(sort:{fields: [lastEpisodeDate], order: DESC}) {
      edges {
        node {
          slug
          episodes {
            id
            podcastTitle
            episodeTitle
            audioUrl
            published
          }
        }
      }
    }    
  }
`
