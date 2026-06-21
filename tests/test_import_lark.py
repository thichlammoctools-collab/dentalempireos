"""Tests for import-lark.py — Lark document import pipeline."""

import sys
import os
import importlib.util
import pytest

# Import import-lark.py (hyphenated filename requires importlib)
_scripts_dir = os.path.join(os.path.dirname(__file__), '..', 'scripts')
_spec = importlib.util.spec_from_file_location(
    "import_lark", os.path.join(_scripts_dir, "import-lark.py")
)
import_lark = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(import_lark)


class TestSlugs:
    def test_slugify_basic(self):
        assert import_lark.slugify("Hello World") == "hello-world"

    def test_slugify_vietnamese(self):
        result = import_lark.slugify("Phân Tích Thống Kê")
        assert "phan-tich" in result
        assert "thong-ke" in result

    def test_slugify_special_chars(self):
        result = import_lark.slugify("Test & Validation!")
        assert result == "test-validation"

    def test_slugify_multiple_spaces(self):
        result = import_lark.slugify("Too   Many    Spaces")
        assert "  " not in result
        assert result == "too-many-spaces"


class TestEscapeSQL:
    def test_escape_sql_safe(self):
        assert import_lark.esc_sql("hello") == "hello"

    def test_escape_sql_single_quote(self):
        result = import_lark.esc_sql("it's")
        assert "''" in result

    def test_escape_sql_empty(self):
        assert import_lark.esc_sql("") == ""


class TestXMLParser:
    def test_parse_simple_paragraphs(self):
        content = "<p>First paragraph</p><p>Second paragraph</p>"
        nodes = import_lark.parse_lark_xml(content)
        assert len(nodes) == 2
        assert nodes[0]["type"] == "text"
        assert "First paragraph" in nodes[0]["html"]

    def test_parse_headings(self):
        import_lark.parse_lark_xml._first_h1_done = False
        content = "<h1>Title</h1><h2>Section 1</h2><h3>Subsection</h3>"
        nodes = import_lark.parse_lark_xml(content)
        headings = [n for n in nodes if n["type"] == "heading"]
        assert len(headings) >= 2

    def test_parse_images(self):
        content = '<img src="abc123" name="photo.png" href="http://example.com/img.png"/>'
        nodes = import_lark.parse_lark_xml(content)
        images = [n for n in nodes if n["type"] == "image"]
        assert len(images) == 1
        assert images[0]["src"] == "abc123"

    def test_parse_empty_content(self):
        import_lark.parse_lark_xml._first_h1_done = False
        nodes = import_lark.parse_lark_xml("")
        assert nodes == []

    def test_parse_callout(self):
        content = '<callout emoji="💡"><p>Important tip here</p></callout>'
        nodes = import_lark.parse_lark_xml(content)
        assert len(nodes) >= 1
        assert "💡" in nodes[0]["html"]

    def test_parse_blockquote(self):
        content = '<blockquote><p>Quoted text</p></blockquote>'
        nodes = import_lark.parse_lark_xml(content)
        assert len(nodes) >= 1


class TestSectionTree:
    def test_flat_sections(self):
        nodes = [
            {"type": "heading", "level": 2, "text": "Section 1"},
            {"type": "text", "html": "<p>Content</p>"},
            {"type": "heading", "level": 2, "text": "Section 2"},
            {"type": "text", "html": "<p>More content</p>"},
        ]
        sections = import_lark.build_section_tree(nodes)
        assert len(sections) == 2
        assert sections[0]["text"] == "Section 1"
        assert sections[0]["level"] == 2

    def test_nested_sections(self):
        nodes = [
            {"type": "heading", "level": 2, "text": "Main"},
            {"type": "heading", "level": 3, "text": "Sub A"},
            {"type": "text", "html": "<p>Content</p>"},
            {"type": "heading", "level": 3, "text": "Sub B"},
            {"type": "heading", "level": 2, "text": "Main 2"},
        ]
        sections = import_lark.build_section_tree(nodes)
        assert len(sections) == 2
        assert len(sections[0]["children"]) == 2
        assert sections[0]["children"][0]["text"] == "Sub A"

    def test_deep_nesting(self):
        nodes = [
            {"type": "heading", "level": 2, "text": "L2"},
            {"type": "heading", "level": 3, "text": "L3"},
            {"type": "heading", "level": 4, "text": "L4"},
            {"type": "heading", "level": 5, "text": "L5"},
        ]
        sections = import_lark.build_section_tree(nodes)
        assert len(sections) == 1
        assert sections[0]["children"][0]["children"][0]["children"][0]["text"] == "L5"


class TestSQLGeneration:
    def test_generate_basic_sql(self):
        sections = [
            {
                "id": "test-id-1",
                "text": "Test Section",
                "level": 2,
                "children": [],
                "content": [{"type": "text", "html": "<p>Hello world</p>"}],
            }
        ]
        sql, section_count, block_count = import_lark.generate_sql(
            "test-chapter", 1, 1, "Test Chapter", "Test desc", sections, {}
        )
        assert "test-chapter" in sql
        assert "INSERT OR IGNORE INTO section" in sql
        assert "INSERT OR IGNORE INTO block" in sql
        assert section_count == 1
        assert block_count >= 1


class TestWebPConversion:
    def test_conversion_skipped_when_no_images(self):
        result = import_lark.convert_to_webp([])
        assert result == {}


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
