import { query as q } from 'faunadb';
import { formatFokontany } from '../../formater';
import lowercasekeys from 'lowercase-keys';

export const Fokontany = {
  fokontany: async (parent, { id }, context) => {
    const result = await context.client.query(
      q.Get(q.Ref(q.Collection('fokontany'), id))
    )
    if (!result.ref) {
      return {}
    }
    return {
      id: result.ref.value.id,
      geometry: {
        type: result.data.Geometry.Type,
        polygon: result.data.Geometry.Type === 'Polygon' ? lowercasekeys(result.data.Geometry) : null,
        multipolygon: result.data.Geometry.Type === 'MultiPolygon' ? lowercasekeys(result.data.Geometry) : null
      },
      name: result.data.Name,
      province: result.data.Province,
      code: result.data.Code,
      commune: result.data.Commune,
      district: result.data.District,
      region: result.data.Region,
    };
  },
  allFokontany: async (parent, args, context) => {
    const { data } = await context.client.query(
      q.Paginate(
        q.Match(q.Index('all_fokontany')),
      ) 
    );
    return formatFokontany(data);
  },
  countFokontany: async (parent, args, context) => {
    const { data } = await context.client.query(
      q.Paginate(
        q.Match(q.Index('all_fokontany')),
        { size: 50000 },
      ) 
    );
    return data.length;
  }
}
