const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
}

const indexHtml = read('index.html');
const appJs = read('app.js');
const stylesCss = read('styles.css');
const translationsJs = read('translations.js');

function assertIncludes(text, snippet, message) {
  assert.ok(text.includes(snippet), message);
}

function testHeroCtasExist() {
  assertIncludes(indexHtml, 'id="explore-btn"', 'primary CTA should exist');
  assertIncludes(indexHtml, 'id="learn-btn"', 'secondary CTA should exist');
}

function testAboutSectionComesAfterNamesSection() {
  const namesIndex = indexHtml.indexOf('id="names-section"');
  const aboutIndex = indexHtml.indexOf('id="about-section"');
  assert.ok(namesIndex !== -1 && aboutIndex !== -1, 'names and about sections should exist');
  assert.ok(aboutIndex > namesIndex, 'about section should come after names section');
}

function testReadingModeControlsExist() {
  assertIncludes(indexHtml, 'id="search-toggle-btn"', 'search toggle should exist');
  assertIncludes(indexHtml, 'id="prev-page-btn"', 'previous page button should exist');
  assertIncludes(indexHtml, 'id="next-page-btn"', 'next page button should exist');
  assertIncludes(indexHtml, 'id="reading-progress"', 'reading progress element should exist');
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
testTranslationsExist();

console.log('ux structure tests passed');
