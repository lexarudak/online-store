import plants from '../../data/plants.json';

export function isPlantsId(id: string) {
  console.log(plants.total, id);
  if (Number(id) > 0 && Number(id) < plants.total) {
    return true;
  }
  return false;
}
