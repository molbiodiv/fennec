describe("Test the organismDetails file", function() {

  it("Test for getBestName on empty set", function() {
    expect(getBestName({})).toBe('');
  });
  it("Test for getBestName with only sciname", function() {
    expect(getBestName({'scientificName': 'Mus musculus'})).toBe('Mus musculus');
    expect(getBestName({'scientificName': 'Vulpes zerda', 'vernacularNames': []})).toBe('Vulpes zerda');
  });
  it("Test for getBestName with common names (no preffered name)", function() {
    expect(getBestName({'scientificName': 'Vulpes zerda', 'vernacularNames': [{'language': 'en', 'vernacularName': 'Fennec'}]})).toBe('Fennec');
  });
  it("Test for getBestName with common names (preffered name)", function() {
    expect(getBestName({})).toBe('');
  });
});