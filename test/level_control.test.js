import { shallowMount } from '@vue/test-utils';
import LevelControl from '../js/level_control';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({})
}));

describe('LevelControl', () => {
  let control;
  beforeEach(() => {
    control = shallowMount(LevelControl, {
      propsData: {
        value: 0,
        layer: 'testLayer',
        source: 'testSource'
      },
      provide: {
        actions: {},
        map: {
          on() {}
        },
        mapbox: {}
      }
    });
  });

  it('create a container', () => {
    expect(control.contains('.mapboxgl-ctrl')).toBe(true);
    expect(control.contains('.mapboxgl-ctrl-group')).toBe(true);
  });

  it('render the levels as button', () => {
    control.vm.levels = [1, 0];
    expect(control.findAll('button').length).toEqual(2);
  });

  it('render no levels if only one is available', () => {
    control.vm.levels = [0];
    expect(control.findAll('button').length).toEqual(0);
  });

  it('dont query the layer when the layer is not loaded', () => {
    expect(control.vm.levels).toEqual([]);
    control.setMethods({ findAllLevels() { return [1, 0]; } });
    control.vm.map.isSourceLoaded = (source) => {
      expect(source).toEqual('testSource');
      return false;
    };
    control.vm.updateLevels();
    expect(control.vm.levels).toEqual([]);
  });

  it('query the layer when the layer is loaded and display levels', () => {
    expect(control.vm.levels).toEqual([]);
    control.setMethods({ findAllLevels() { return [1, 0]; } });
    control.vm.map.isSourceLoaded = (source) => {
      expect(source).toEqual('testSource');
      return true;
    };
    control.vm.map.querySourceFeatures = (source, filter) => {
      expect(source).toEqual('testSource');
      expect(filter).toEqual({
        sourceLayer: 'testLayer',
        filter: ['has', 'level']
      });
    };
    control.vm.updateLevels();
    expect(control.vm.levels).toEqual([1, 0]);
  });

  it('emit the value when clicking on a level', () => {
    control.vm.levels = [1, 0];
    control.find('button:first-child').trigger('click');
    expect(control.emitted('input')[0]).toEqual([1]);
  });

  it('reset the value to 0 if the currentLevel doesnt exist', () => {
    control.vm.levels = [1, 0];
    control.setProps({ value: 1 });
    control.vm.levels = [0];
    expect(control.emitted('input')[0]).toEqual([0]);
  });
});
