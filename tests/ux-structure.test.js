const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
}

const pageSource = read('src/pages/index.astro');
const appJs = read('public/app.js');
const stylesCss = read('public/styles.css');
const translationsJs = read('public/translations.js');
const headersFile = read('public/_headers');

function assertIncludes(text, snippet, message) {
  assert.ok(text.includes(snippet), message);
}

function testHeroCtasExist() {
  assertIncludes(pageSource, 'id="explore-btn"', 'primary CTA should exist');
  assertIncludes(pageSource, 'id="learn-btn"', 'secondary CTA should exist');
}

function testAboutSectionComesAfterNamesSection() {
  const namesIndex = pageSource.indexOf('id="names-section"');
  const aboutIndex = pageSource.indexOf('id="about-section"');
  assert.ok(namesIndex !== -1 && aboutIndex !== -1, 'names and about sections should exist');
  assert.ok(aboutIndex > namesIndex, 'about section should come after names section');
}

function testReadingModeControlsExist() {
  assertIncludes(pageSource, 'id="search-toggle-btn"', 'search toggle should exist');
  assertIncludes(pageSource, 'id="prev-page-btn"', 'previous page button should exist');
  assertIncludes(pageSource, 'id="next-page-btn"', 'next page button should exist');
  assertIncludes(pageSource, 'id="reading-progress"', 'reading progress element should exist');
}

function testAppHooksExist() {
  assertIncludes(appJs, 'function scrollToAbout()', 'learn CTA handler should exist');
  assertIncludes(appJs, 'function goToPreviousPage()', 'previous page handler should exist');
  assertIncludes(appJs, 'function goToNextPage()', 'next page handler should exist');
  assertIncludes(appJs, 'function updatePagination()', 'pagination updater should exist');
  assertIncludes(appJs, 'function toggleSearchPanel()', 'search toggle handler should exist');
}

function testCollapsedReadingModeMarkup() {
  assertIncludes(appJs, 'detailMarkup', 'detail markup should be built lazily inside expanded content');
  assert.ok(!appJs.includes('<p class="card-meaning">${oneLine}</p>\n      \n      <button'), 'meaning should not render before the reveal button');
}

function testStylesSupportMobileSearchAndPagination() {
  assertIncludes(stylesCss, '.search-panel.mobile-collapsed', 'mobile search collapse styles should exist');
  assertIncludes(stylesCss, '.reading-pagination', 'reading pagination styles should exist');
}

function testVersionedStaticAssetsExist() {
  assertIncludes(pageSource, 'const assetVersion = Date.now().toString(36);', 'Astro page should create a per-build asset version');
  assertIncludes(pageSource, 'window.__ASSET_VERSION__ = assetVersion;', 'asset version should be exposed to client scripts');
  assertIncludes(pageSource, 'src={versionedAsset(\'/app.js\')}', 'app script should be cache-busted');
  assertIncludes(pageSource, 'src={versionedAsset(\'/navigation.js\')}', 'navigation script should be cache-busted');
  assertIncludes(pageSource, 'src={versionedAsset(\'/translations.js\')}', 'translations script should be cache-busted');
  assertIncludes(pageSource, 'href={versionedAsset(\'/styles.min.css\')}', 'stylesheet should be cache-busted');
}

function testJsonFetchesUseVersionedUrls() {
  assertIncludes(appJs, 'function getAssetUrl(path)', 'app should centralize versioned asset URLs');
  assertIncludes(appJs, "fetch(getAssetUrl('/data_manifest.json'))", 'manifest fetch should be cache-busted');
  assertIncludes(appJs, 'fetch(getAssetUrl(`/data_chunk_${chunkNum}.json`))', 'chunk fetches should be cache-busted');
}

function testHeadersDoNotMarkMutableAssetsImmutable() {
  assertIncludes(headersFile, '/app.js', 'headers should define app.js caching');
  assertIncludes(headersFile, '/translations.js', 'headers should define translations.js caching');
  assert.ok(!headersFile.includes('/app.js\n  Cache-Control: public, max-age=2592000, immutable'), 'app.js should no longer be immutable');
  assert.ok(!headersFile.includes('/data_manifest.json\n  Cache-Control: public, max-age=2592000, immutable'), 'data manifest should no longer be immutable');
}

function testTranslationsExist() {
  [
    'landing.learnButton',
    'names.readingModeTitle',
    'names.readingModeText',
    'names.showSearchButton',
    'names.hideSearchButton',
    'names.previousButton',
    'names.nextButton',
    'names.pageStatus'
  ].forEach((key) => assertIncludes(translationsJs, key.split('.').pop(), `translation key ${key} should exist`));
}

testHeroCtasExist();
testAboutSectionComesAfterNamesSection();
testReadingModeControlsExist();
testAppHooksExist();
testCollapsedReadingModeMarkup();
testStylesSupportMobileSearchAndPagination();
testVersionedStaticAssetsExist();
testJsonFetchesUseVersionedUrls();
testHeadersDoNotMarkMutableAssetsImmutable();
testTranslationsExist();

console.log('ux structure tests passed');
