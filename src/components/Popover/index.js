import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { Tag } from 'antd'
import MDSpinner from 'react-md-spinner'
import PopoverList from './PopoverList'

const SEARCH = gql`
  query Search($keyword: String!) {
    search(keyword: $keyword) {
      regions {
        id
        name
        code
      }
      fokontany {
        id
        name
        commune
        district
        region
        code
      }
      districts {
        id
        name
        region
        code
      }
      communes {
        id
        name
        district
        region
        code
      }
    }
    countRegions
    countDistricts
    countCommunes
    countFokontany
  }
`

const Popover = (props) => {
  const [filter, setFilter] = useState(1)
  const [keyword, setKeyword] = useState('')
  const { loading, error, data } = useQuery(SEARCH, { variables: { keyword } })
  const handleUpdate = () => {
    console.log('load more ...')
  }
  return (
    <div id='search-popover' className={props.popoverClass}>
      <div style={{ display: 'flex', height: 64 }} onClick={() => props.setExpanded(true)}>
        <input
          id='search'
          placeholder='Search ...'
          style={{ marginLeft: 50 }}
          autoComplete='off'
          onChange={evt => {
            if (evt.target.value.length > 2 || evt.target.value.length === 0) {
              setKeyword(evt.target.value)
            }
          }}
        />
        <svg
          xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 14 14' className='search-icon'
          style={{ position: 'absolute', top: 20, left: 15 }}
        >
          <g fill='none' fillRule='evenodd'>
            <path d='M-5-5v24h24V-5z' />
            <path fill='#5C5C6E' fillRule='nonzero' d='M12.003 13.657L8.96 10.616c-.016-.016-.027-.035-.042-.052a5.756 5.756 0 1 1 1.645-1.645c.017.015.036.026.052.042l3.041 3.042a1.17 1.17 0 0 1-1.654 1.654zM9.516 5.756a3.76 3.76 0 1 0-7.52 0 3.76 3.76 0 0 0 7.52 0z' />
          </g>
        </svg>
      </div>
      {
        (loading || error) && (
          <div id='loader'>
            <MDSpinner />
          </div>
        )
      }
      {
        !loading && !error && (
          <div style={{ padding: 10 }}>
            <Tag
              color='cyan'
              className={`tag ${filter !== 1 ? 'inactive' : ''}`}
              onClick={() => setFilter(1)}
            >
              Regions ({keyword === '' ? data.countRegions : data.search.regions.length})
            </Tag>
            <Tag
              color='cyan'
              className={`tag ${filter !== 2 ? 'inactive' : ''}`}
              onClick={() => setFilter(2)}
            >
              Districts ({keyword === '' ? data.countDistricts : data.search.districts.length})
            </Tag>
            <Tag
              color='cyan'
              className={`tag ${filter !== 3 ? 'inactive' : ''}`}
              onClick={() => setFilter(3)}
            >
              Communes ({keyword === '' ? data.countCommunes : data.search.communes.length})
            </Tag>
            <Tag
              color='cyan'
              className={`tag ${filter !== 4 ? 'inactive' : ''}`}
              onClick={() => setFilter(4)}
            >
              Fokontany ({keyword === '' ? data.countFokontany : data.search.fokontany.length})
            </Tag>
          </div>
        )
      }
      <PopoverList {...{ filter, data, error, handleUpdate, loading }} />
    </div>
  )
}

export default Popover
