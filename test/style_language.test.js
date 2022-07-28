import { updateStyle } from '../js/style_language';

describe('StyleLanguage', () => {
  it('update text-field with get:name', () => {
    const style = {
      layers: [
        {
          layout: {
            'text-field': ['get', 'name']
          }
        }
      ]
    };
    const newStyle = updateStyle(style, 'fr');
    expect(newStyle).toEqual({
      layers: [
        {
          layout: {
            'text-field': [
              'coalesce',
              ['get', 'name:fr'],
              ['get', 'name'],
            ]
          }
        }
      ]
    });
  });

  it('update text-field with get name:latin', () => {
    const style = {
      layers: [
        {
          layout: {
            'text-field': ['get', 'name:latin']
          }
        }
      ]
    };
    const newStyle = updateStyle(style, 'fr');
    expect(newStyle).toEqual({
      layers: [
        {
          layout: {
            'text-field': [
              'coalesce',
              ['get', 'name:fr'],
              ['get', 'name:latin'],
            ]
          }
        }
      ]
    });
  });

  it('update text-field with concat name:latin', () => {
    const style = {
      layers: [
        {
          layout: {
            'text-field': ['concat', ['get', 'name:latin'], '\n', ['get', 'name:nonlatin']]
          }
        }
      ]
    };
    const newStyle = updateStyle(style, 'fr');
    expect(newStyle).toEqual({
      layers: [
        {
          layout: {
            'text-field': [
              'concat',
              ['coalesce',
               ['get', 'name:fr'],
               ['get', 'name:latin']],
              '\n',
              ['get', 'name:nonlatin'],
            ]
          }
        }
      ]
    });
  });

  it('update text-field with token expression', () => {
    const style = {
      layers: [
        {
          layout: {
            'text-field': '{name:latin}'
          }
        }
      ]
    };
    const newStyle = updateStyle(style, 'fr');
    expect(newStyle).toEqual({
      layers: [
        {
          layout: {
            'text-field': ['coalesce',
                           ['get', 'name:fr'],
                           ['get', 'name:latin']]
          }
        }
      ]
    });
  });

  it('update text-field with multiple token expression', () => {
    const style = {
      layers: [
        {
          layout: {
            'text-field': '{name:latin}\n{name:nonlatin}'
          }
        }
      ]
    };
    const newStyle = updateStyle(style, 'fr');
    expect(newStyle).toEqual({
      layers: [
        {
          layout: {
            'text-field': ['concat', ['coalesce',
                           ['get', 'name:fr'],
                           ['get', 'name:latin']], '\n', ['get', 'name:nonlatin']]
          }
        }
      ]
    });
  });
});
