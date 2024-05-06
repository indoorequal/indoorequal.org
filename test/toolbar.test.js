import { shallowMount } from '@vue/test-utils';
import IndoorToolbar from '../js/toolbar';

describe('Toolbar', () => {
  let toolbar;
  beforeEach(() => {
    toolbar = shallowMount(IndoorToolbar, {
      global: {
        $t: () => {},
        stubs: ['v-card', 'v-divider', 'v-list', 'v-list-item', 'v-list-item-title', 'v-menu', 'v-tooltip', 'v-list-subheader', 'v-icon', 'v-btn', 'v-badge']
      },
      props: {
        value: null,
        mapCenter: { lat: 1, lng: 2 },
        mapLevel: '1',
        mapZoom: 17,
        indoorMinZoom: 17
      },
    });
  });

  it('creates the osm.org URL', async () => {
    await toolbar.setProps({
      mapCenter: { lat: 3, lng: 4 },
      mapZoom: 18
    });
    expect(toolbar.vm.OSMUrl).toEqual('https://www.openstreetmap.org/edit?editor=id#map=18/3/4');
  });

  it('creates the JOSM URL', async () => {
    await toolbar.setProps({
      mapBounds: [0, 1, 2, 3]
    });
    expect(toolbar.vm.JOSMUrl).toEqual('http://localhost:8111/load_and_zoom?left=0&right=2&top=3&bottom=1');
  });

  it('creates the Vespucci URL', async () => {
    await toolbar.setProps({
      mapBounds: [0, 1, 2, 3]
    });
    expect(toolbar.vm.VespucciUrl).toEqual('josm:/load_and_zoom?left=0&right=2&top=3&bottom=1');
  });

  it('creates the OsmInEdit URL', async () => {
    await toolbar.setProps({
      mapCenter: { lat: 3, lng: 4 },
      mapZoom: 18
    });
    expect(toolbar.vm.OsmInEditUrl).toEqual('https://osminedit.pavie.info/#18/3/4');
  });

  it('creates the OpenLevelUp URL', async () => {
    await toolbar.setProps({
      mapCenter: { lat: 3, lng: 4 },
      mapLevel: '2',
      mapZoom: 18
    });
    expect(toolbar.vm.OpenLevelUpUrl).toEqual('https://openlevelup.net/?l=2#18/3/4');
  });
});
