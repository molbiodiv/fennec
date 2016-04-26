describe("Test the organismDetails file", function() {

  it("Test for getBestVernacularNameEOL on empty set", function() {
    expect(getBestVernacularNameEOL({})).toBe('');
  });
  it("Test for getBestVernacularNameEOL with only sciname", function() {
    expect(getBestVernacularNameEOL({'scientificName': 'Mus musculus'})).toBe('Mus musculus');
    expect(getBestVernacularNameEOL({'scientificName': 'Vulpes zerda', 'vernacularNames': []})).toBe('Vulpes zerda');
  });
  it("Test for getBestVernacularNameEOL with common names (no preffered name)", function() {
    expect(getBestVernacularNameEOL({'scientificName': 'Vulpes zerda', 'vernacularNames': [{'language': 'en', 'vernacularName': 'Fennec'}]})).toBe('Fennec');
  });
  it("Test for getBestVernacularNameEOL with common names (preffered name)", function() {
    expect(getBestVernacularNameEOL({'scientificName': 'Vulpes zerda', 'vernacularNames': [
        { vernacularName:"Fennec",  language:"en"},
        { vernacularName:"Fennec fox",  language:"en", eol_preferred:true},
        { vernacularName:"Fennekki",  language:"fi",  eol_preferred:true},
	{ vernacularName:"Aavikkokettu",  language:"fi"},
	{ vernacularName:"Fennec",  language:"fr",  eol_preferred:true},
	{ vernacularName:"Woestijnvos",  language:"nl",  eol_preferred:true},
	{ vernacularName:"Fennek",  language:"nl"},
	{ vernacularName:"Feneco",  language:"pt-BR",  eol_preferred:true},
        { vernacularName:"The Fennec",  language:"en"},
	{ vernacularName:"Raposa-do-deserto",  language:"pt-BR"}]
    })).toBe('Fennec fox');
  });
});