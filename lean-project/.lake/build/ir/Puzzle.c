// Lean compiler output
// Module: Puzzle
// Imports: public import Init public meta import Init
#include <lean/lean.h>
#if defined(__clang__)
#pragma clang diagnostic ignored "-Wunused-parameter"
#pragma clang diagnostic ignored "-Wunused-label"
#elif defined(__GNUC__) && !defined(__CLANG__)
#pragma GCC diagnostic ignored "-Wunused-parameter"
#pragma GCC diagnostic ignored "-Wunused-label"
#pragma GCC diagnostic ignored "-Wunused-but-set-variable"
#endif
#ifdef __cplusplus
extern "C" {
#endif
lean_object* lean_nat_to_int(lean_object*);
lean_object* l_Repr_addAppParen(lean_object*, lean_object*);
uint8_t lean_nat_dec_le(lean_object*, lean_object*);
lean_object* l_Option_repr___at___00Lean_Meta_instReprConfig__1_repr_spec__0(lean_object*, lean_object*);
lean_object* lean_string_length(lean_object*);
lean_object* l_List_reverse___redArg(lean_object*);
lean_object* lean_string_append(lean_object*, lean_object*);
lean_object* l_Nat_reprFast(lean_object*);
lean_object* l_List_lengthTR___redArg(lean_object*);
uint8_t lean_nat_dec_lt(lean_object*, lean_object*);
uint8_t lean_nat_dec_eq(lean_object*, lean_object*);
lean_object* l_List_getD___redArg(lean_object*, lean_object*, lean_object*);
lean_object* lean_mk_empty_array_with_capacity(lean_object*);
lean_object* l___private_Init_Data_List_Impl_0__List_setTR_go___redArg(lean_object*, lean_object*, lean_object*, lean_object*, lean_object*);
lean_object* lean_nat_add(lean_object*, lean_object*);
lean_object* lean_nat_mod(lean_object*, lean_object*);
lean_object* l_String_intercalate(lean_object*, lean_object*);
lean_object* lean_string_push(lean_object*, uint32_t);
lean_object* lean_get_stdout();
lean_object* lean_array_mk(lean_object*);
lean_object* lean_array_get_size(lean_object*);
size_t lean_usize_of_nat(lean_object*);
uint8_t lean_usize_dec_eq(size_t, size_t);
size_t lean_usize_sub(size_t, size_t);
lean_object* lean_array_uget_borrowed(lean_object*, size_t);
lean_object* l_List_appendTR___redArg(lean_object*, lean_object*);
lean_object* l_instDecidableEqNat___boxed(lean_object*, lean_object*);
uint8_t l_Option_instDecidableEq___redArg(lean_object*, lean_object*, lean_object*);
lean_object* l_List_range(lean_object*);
uint8_t lean_nat_dec_le(lean_object*, lean_object*);
lean_object* lean_nat_sub(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorIdx(uint8_t);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorIdx___boxed(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorElim___redArg(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorElim___redArg___boxed(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorElim(lean_object*, lean_object*, uint8_t, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorElim___boxed(lean_object*, lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_blue_elim___redArg(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_blue_elim___redArg___boxed(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_blue_elim(lean_object*, uint8_t, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_blue_elim___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_green_elim___redArg(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_green_elim___redArg___boxed(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_green_elim(lean_object*, uint8_t, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_green_elim___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_red_elim___redArg(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_red_elim___redArg___boxed(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_red_elim(lean_object*, uint8_t, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_red_elim___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_yellow_elim___redArg(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_yellow_elim___redArg___boxed(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_yellow_elim(lean_object*, uint8_t, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_yellow_elim___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_purple_elim___redArg(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_purple_elim___redArg___boxed(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_purple_elim(lean_object*, uint8_t, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_purple_elim___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_Color_ofNat(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ofNat___boxed(lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_instDecidableEqColor(uint8_t, uint8_t);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instDecidableEqColor___boxed(lean_object*, lean_object*);
static const lean_string_object lp_puzzle_Puzzle_instReprColor_repr___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 18, .m_capacity = 18, .m_length = 17, .m_data = "Puzzle.Color.blue"};
static const lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__0_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprColor_repr___closed__1_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__0_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__1 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__1_value;
static const lean_string_object lp_puzzle_Puzzle_instReprColor_repr___closed__2_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 19, .m_capacity = 19, .m_length = 18, .m_data = "Puzzle.Color.green"};
static const lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__2 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__2_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprColor_repr___closed__3_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__2_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__3 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__3_value;
static const lean_string_object lp_puzzle_Puzzle_instReprColor_repr___closed__4_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 17, .m_capacity = 17, .m_length = 16, .m_data = "Puzzle.Color.red"};
static const lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__4 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__4_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprColor_repr___closed__5_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__4_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__5 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__5_value;
static const lean_string_object lp_puzzle_Puzzle_instReprColor_repr___closed__6_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 20, .m_capacity = 20, .m_length = 19, .m_data = "Puzzle.Color.yellow"};
static const lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__6 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__6_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprColor_repr___closed__7_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__6_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__7 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__7_value;
static const lean_string_object lp_puzzle_Puzzle_instReprColor_repr___closed__8_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 20, .m_capacity = 20, .m_length = 19, .m_data = "Puzzle.Color.purple"};
static const lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__8 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__8_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprColor_repr___closed__9_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__8_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__9 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor_repr___closed__9_value;
static lean_once_cell_t lp_puzzle_Puzzle_instReprColor_repr___closed__10_once = LEAN_ONCE_CELL_INITIALIZER;
static lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__10;
static lean_once_cell_t lp_puzzle_Puzzle_instReprColor_repr___closed__11_once = LEAN_ONCE_CELL_INITIALIZER;
static lean_object* lp_puzzle_Puzzle_instReprColor_repr___closed__11;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instReprColor_repr(uint8_t, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instReprColor_repr___boxed(lean_object*, lean_object*);
static const lean_closure_object lp_puzzle_Puzzle_instReprColor___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_closure_object) + sizeof(void*)*0, .m_other = 0, .m_tag = 245}, .m_fun = (void*)lp_puzzle_Puzzle_instReprColor_repr___boxed, .m_arity = 2, .m_num_fixed = 0, .m_objs = {} };
static const lean_object* lp_puzzle_Puzzle_instReprColor___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_instReprColor___closed__0_value;
LEAN_EXPORT const lean_object* lp_puzzle_Puzzle_instReprColor = (const lean_object*)&lp_puzzle_Puzzle_instReprColor___closed__0_value;
static const lean_string_object lp_puzzle_Puzzle_Color_name___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 5, .m_capacity = 5, .m_length = 4, .m_data = "blue"};
static const lean_object* lp_puzzle_Puzzle_Color_name___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_Color_name___closed__0_value;
static const lean_string_object lp_puzzle_Puzzle_Color_name___closed__1_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 6, .m_capacity = 6, .m_length = 5, .m_data = "green"};
static const lean_object* lp_puzzle_Puzzle_Color_name___closed__1 = (const lean_object*)&lp_puzzle_Puzzle_Color_name___closed__1_value;
static const lean_string_object lp_puzzle_Puzzle_Color_name___closed__2_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 4, .m_capacity = 4, .m_length = 3, .m_data = "red"};
static const lean_object* lp_puzzle_Puzzle_Color_name___closed__2 = (const lean_object*)&lp_puzzle_Puzzle_Color_name___closed__2_value;
static const lean_string_object lp_puzzle_Puzzle_Color_name___closed__3_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 7, .m_capacity = 7, .m_length = 6, .m_data = "yellow"};
static const lean_object* lp_puzzle_Puzzle_Color_name___closed__3 = (const lean_object*)&lp_puzzle_Puzzle_Color_name___closed__3_value;
static const lean_string_object lp_puzzle_Puzzle_Color_name___closed__4_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 7, .m_capacity = 7, .m_length = 6, .m_data = "purple"};
static const lean_object* lp_puzzle_Puzzle_Color_name___closed__4 = (const lean_object*)&lp_puzzle_Puzzle_Color_name___closed__4_value;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_name(uint8_t);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_name___boxed(lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_instDecidableEqCell_decEq(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instDecidableEqCell_decEq___boxed(lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_instDecidableEqCell(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instDecidableEqCell___boxed(lean_object*, lean_object*);
static const lean_string_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 3, .m_capacity = 3, .m_length = 2, .m_data = "{ "};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__0_value;
static const lean_string_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__1_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 6, .m_capacity = 6, .m_length = 5, .m_data = "color"};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__1 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__1_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__2_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__1_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__2 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__2_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__3_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*2 + 0, .m_other = 2, .m_tag = 5}, .m_objs = {((lean_object*)(((size_t)(0) << 1) | 1)),((lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__2_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__3 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__3_value;
static const lean_string_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__4_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 5, .m_capacity = 5, .m_length = 4, .m_data = " := "};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__4 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__4_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__5_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__4_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__5 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__5_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__6_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*2 + 0, .m_other = 2, .m_tag = 5}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__3_value),((lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__5_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__6 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__6_value;
static lean_once_cell_t lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__7_once = LEAN_ONCE_CELL_INITIALIZER;
static lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__7;
static const lean_string_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__8_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 2, .m_capacity = 2, .m_length = 1, .m_data = ","};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__8 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__8_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__9_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__8_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__9 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__9_value;
static const lean_string_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__10_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 4, .m_capacity = 4, .m_length = 3, .m_data = "rot"};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__10 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__10_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__11_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__10_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__11 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__11_value;
static lean_once_cell_t lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__12_once = LEAN_ONCE_CELL_INITIALIZER;
static lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__12;
static const lean_string_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__13_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 3, .m_capacity = 3, .m_length = 2, .m_data = " }"};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__13 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__13_value;
static lean_once_cell_t lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__14_once = LEAN_ONCE_CELL_INITIALIZER;
static lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__14;
static lean_once_cell_t lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__15_once = LEAN_ONCE_CELL_INITIALIZER;
static lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__15;
static const lean_ctor_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__16_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__0_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__16 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__16_value;
static const lean_ctor_object lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__17_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 3}, .m_objs = {((lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__13_value)}};
static const lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__17 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__17_value;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instReprCell_repr(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instReprCell_repr___boxed(lean_object*, lean_object*);
static const lean_closure_object lp_puzzle_Puzzle_instReprCell___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_closure_object) + sizeof(void*)*0, .m_other = 0, .m_tag = 245}, .m_fun = (void*)lp_puzzle_Puzzle_instReprCell_repr___boxed, .m_arity = 2, .m_num_fixed = 0, .m_objs = {} };
static const lean_object* lp_puzzle_Puzzle_instReprCell___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_instReprCell___closed__0_value;
LEAN_EXPORT const lean_object* lp_puzzle_Puzzle_instReprCell = (const lean_object*)&lp_puzzle_Puzzle_instReprCell___closed__0_value;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_ctorIdx(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_ctorIdx___boxed(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_ctorElim___redArg(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_ctorElim(lean_object*, lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_ctorElim___boxed(lean_object*, lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_swap_elim___redArg(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_swap_elim(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_paint_elim___redArg(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_paint_elim(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_rotate_elim___redArg(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_rotate_elim(lean_object*, lean_object*, lean_object*, lean_object*);
static const lean_ctor_object lp_puzzle_Puzzle_blank___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 8, .m_other = 1, .m_tag = 0}, .m_objs = {((lean_object*)(((size_t)(0) << 1) | 1)),LEAN_SCALAR_PTR_LITERAL(0, 0, 0, 0, 0, 0, 0, 0)}};
static const lean_object* lp_puzzle_Puzzle_blank___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_blank___closed__0_value;
LEAN_EXPORT const lean_object* lp_puzzle_Puzzle_blank = (const lean_object*)&lp_puzzle_Puzzle_blank___closed__0_value;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_height(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_height___boxed(lean_object*);
static lean_once_cell_t lp_puzzle_Puzzle_width___closed__0_once = LEAN_ONCE_CELL_INITIALIZER;
static lean_object* lp_puzzle_Puzzle_width___closed__0;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_width(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_width___boxed(lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_inside(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_inside___boxed(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_getCell(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_getCell___boxed(lean_object*, lean_object*, lean_object*);
static const lean_array_object lp_puzzle_Puzzle_setCell___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_array_object) + sizeof(void*)*0, .m_other = 0, .m_tag = 246}, .m_size = 0, .m_capacity = 0, .m_data = {}};
static const lean_object* lp_puzzle_Puzzle_setCell___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_setCell___closed__0_value;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_setCell(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__4(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__4___boxed(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_List_elem___at___00Puzzle_check_spec__0(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_elem___at___00Puzzle_check_spec__0___boxed(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__3(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__3___boxed(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__2(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__2___boxed(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__1(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__1___boxed(lean_object*, lean_object*);
static const lean_ctor_object lp_puzzle_Puzzle_check___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 1}, .m_objs = {((lean_object*)(((size_t)(0) << 1) | 1))}};
static const lean_object* lp_puzzle_Puzzle_check___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_check___closed__0_value;
static const lean_string_object lp_puzzle_Puzzle_check___closed__1_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 22, .m_capacity = 22, .m_length = 21, .m_data = "Illegal move: block ("};
static const lean_object* lp_puzzle_Puzzle_check___closed__1 = (const lean_object*)&lp_puzzle_Puzzle_check___closed__1_value;
static const lean_string_object lp_puzzle_Puzzle_check___closed__2_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 3, .m_capacity = 3, .m_length = 2, .m_data = ", "};
static const lean_object* lp_puzzle_Puzzle_check___closed__2 = (const lean_object*)&lp_puzzle_Puzzle_check___closed__2_value;
static const lean_string_object lp_puzzle_Puzzle_check___closed__3_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 12, .m_capacity = 12, .m_length = 11, .m_data = ") is locked"};
static const lean_object* lp_puzzle_Puzzle_check___closed__3 = (const lean_object*)&lp_puzzle_Puzzle_check___closed__3_value;
static const lean_string_object lp_puzzle_Puzzle_check___closed__4_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 16, .m_capacity = 16, .m_length = 15, .m_data = "Illegal move: ("};
static const lean_object* lp_puzzle_Puzzle_check___closed__4 = (const lean_object*)&lp_puzzle_Puzzle_check___closed__4_value;
static const lean_string_object lp_puzzle_Puzzle_check___closed__5_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 18, .m_capacity = 18, .m_length = 17, .m_data = ") is outside the "};
static const lean_object* lp_puzzle_Puzzle_check___closed__5 = (const lean_object*)&lp_puzzle_Puzzle_check___closed__5_value;
static const lean_string_object lp_puzzle_Puzzle_check___closed__6_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 2, .m_capacity = 2, .m_length = 1, .m_data = "x"};
static const lean_object* lp_puzzle_Puzzle_check___closed__6 = (const lean_object*)&lp_puzzle_Puzzle_check___closed__6_value;
static const lean_string_object lp_puzzle_Puzzle_check___closed__7_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 7, .m_capacity = 7, .m_length = 6, .m_data = " board"};
static const lean_object* lp_puzzle_Puzzle_check___closed__7 = (const lean_object*)&lp_puzzle_Puzzle_check___closed__7_value;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_check(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_check___boxed(lean_object*, lean_object*, lean_object*);
static const lean_string_object lp_puzzle_Puzzle_apply___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 29, .m_capacity = 29, .m_length = 28, .m_data = ") has no direction to rotate"};
static const lean_object* lp_puzzle_Puzzle_apply___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_apply___closed__0_value;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_apply(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_apply___boxed(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_run(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_run___boxed(lean_object*, lean_object*, lean_object*);
static const lean_string_object lp_puzzle_Puzzle_renderRot___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 2, .m_capacity = 2, .m_length = 1, .m_data = "-"};
static const lean_object* lp_puzzle_Puzzle_renderRot___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_renderRot___closed__0_value;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_renderRot(lean_object*);
static const lean_string_object lp_puzzle_List_mapTR_loop___at___00Puzzle_render_spec__0___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 2, .m_capacity = 2, .m_length = 1, .m_data = ":"};
static const lean_object* lp_puzzle_List_mapTR_loop___at___00Puzzle_render_spec__0___closed__0 = (const lean_object*)&lp_puzzle_List_mapTR_loop___at___00Puzzle_render_spec__0___closed__0_value;
LEAN_EXPORT lean_object* lp_puzzle_List_mapTR_loop___at___00Puzzle_render_spec__0(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_mapTR_loop___at___00Puzzle_render_spec__1(lean_object*, lean_object*);
static const lean_string_object lp_puzzle_Puzzle_render___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 2, .m_capacity = 2, .m_length = 1, .m_data = ";"};
static const lean_object* lp_puzzle_Puzzle_render___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_render___closed__0_value;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_render(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_IO_print___at___00IO_println___at___00Puzzle_runAll_spec__1_spec__1(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_IO_print___at___00IO_println___at___00Puzzle_runAll_spec__1_spec__1___boxed(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_IO_println___at___00Puzzle_runAll_spec__1(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_IO_println___at___00Puzzle_runAll_spec__1___boxed(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_mapTR_loop___at___00Puzzle_runAll_spec__0(lean_object*, lean_object*);
static const lean_string_object lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 2, .m_capacity = 2, .m_length = 1, .m_data = "|"};
static const lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__0 = (const lean_object*)&lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__0_value;
static const lean_string_object lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__1_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 7, .m_capacity = 7, .m_length = 6, .m_data = "ERROR "};
static const lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__1 = (const lean_object*)&lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__1_value;
static const lean_string_object lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__2_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 2, .m_capacity = 2, .m_length = 1, .m_data = " "};
static const lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__2 = (const lean_object*)&lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__2_value;
static const lean_ctor_object lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__3_value = {.m_header = {.m_rc = 0, .m_cs_sz = sizeof(lean_ctor_object) + sizeof(void*)*1 + 0, .m_other = 1, .m_tag = 1}, .m_objs = {((lean_object*)(((size_t)(0) << 1) | 1))}};
static const lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__3 = (const lean_object*)&lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__3_value;
static const lean_string_object lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__4_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 6, .m_capacity = 6, .m_length = 5, .m_data = "STEP "};
static const lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__4 = (const lean_object*)&lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__4_value;
LEAN_EXPORT lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_runAll(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_runAll___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2(lean_object*, lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___boxed(lean_object*, lean_object*, lean_object*, lean_object*, lean_object*, lean_object*);
static const lean_string_object lp_puzzle_Puzzle_runChecked___closed__0_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 7, .m_capacity = 7, .m_length = 6, .m_data = "VALID "};
static const lean_object* lp_puzzle_Puzzle_runChecked___closed__0 = (const lean_object*)&lp_puzzle_Puzzle_runChecked___closed__0_value;
static const lean_string_object lp_puzzle_Puzzle_runChecked___closed__1_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 6, .m_capacity = 6, .m_length = 5, .m_data = "false"};
static const lean_object* lp_puzzle_Puzzle_runChecked___closed__1 = (const lean_object*)&lp_puzzle_Puzzle_runChecked___closed__1_value;
static const lean_string_object lp_puzzle_Puzzle_runChecked___closed__2_value = {.m_header = {.m_rc = 0, .m_cs_sz = 0, .m_other = 0, .m_tag = 249}, .m_size = 5, .m_capacity = 5, .m_length = 4, .m_data = "true"};
static const lean_object* lp_puzzle_Puzzle_runChecked___closed__2 = (const lean_object*)&lp_puzzle_Puzzle_runChecked___closed__2_value;
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_runChecked(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_runChecked___boxed(lean_object*, lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle___private_Init_Data_Array_Basic_0__Array_foldrMUnsafe_fold___at___00List_foldrTR___at___00Puzzle_allCells_spec__0_spec__0(lean_object*, size_t, size_t, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle___private_Init_Data_Array_Basic_0__Array_foldrMUnsafe_fold___at___00List_foldrTR___at___00Puzzle_allCells_spec__0_spec__0___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_foldrTR___at___00Puzzle_allCells_spec__0(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_allCells(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_countP_go___at___00Puzzle_countColor_spec__0(uint8_t, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_countP_go___at___00Puzzle_countColor_spec__0___boxed(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_countColor(lean_object*, uint8_t);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_countColor___boxed(lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0___lam__0(lean_object*, uint8_t, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0___lam__0___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0(lean_object*, uint8_t, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__1(lean_object*, uint8_t, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__1___boxed(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_noAdjacent(lean_object*, uint8_t);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_noAdjacent___boxed(lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__0(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__0___boxed(lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__1(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__1___boxed(lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_rowsUniform(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_rowsUniform___boxed(lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__0(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__0___boxed(lean_object*, lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__1(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__1___boxed(lean_object*);
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_symmetricH(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_symmetricH___boxed(lean_object*);
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorIdx(uint8_t v_x_1_){
_start:
{
switch(v_x_1_)
{
case 0:
{
lean_object* v___x_2_; 
v___x_2_ = lean_unsigned_to_nat(0u);
return v___x_2_;
}
case 1:
{
lean_object* v___x_3_; 
v___x_3_ = lean_unsigned_to_nat(1u);
return v___x_3_;
}
case 2:
{
lean_object* v___x_4_; 
v___x_4_ = lean_unsigned_to_nat(2u);
return v___x_4_;
}
case 3:
{
lean_object* v___x_5_; 
v___x_5_ = lean_unsigned_to_nat(3u);
return v___x_5_;
}
default: 
{
lean_object* v___x_6_; 
v___x_6_ = lean_unsigned_to_nat(4u);
return v___x_6_;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorIdx___boxed(lean_object* v_x_7_){
_start:
{
uint8_t v_x_boxed_8_; lean_object* v_res_9_; 
v_x_boxed_8_ = lean_unbox(v_x_7_);
v_res_9_ = lp_puzzle_Puzzle_Color_ctorIdx(v_x_boxed_8_);
return v_res_9_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorElim___redArg(lean_object* v_k_10_){
_start:
{
lean_inc(v_k_10_);
return v_k_10_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorElim___redArg___boxed(lean_object* v_k_11_){
_start:
{
lean_object* v_res_12_; 
v_res_12_ = lp_puzzle_Puzzle_Color_ctorElim___redArg(v_k_11_);
lean_dec(v_k_11_);
return v_res_12_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorElim(lean_object* v_motive_13_, lean_object* v_ctorIdx_14_, uint8_t v_t_15_, lean_object* v_h_16_, lean_object* v_k_17_){
_start:
{
lean_inc(v_k_17_);
return v_k_17_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ctorElim___boxed(lean_object* v_motive_18_, lean_object* v_ctorIdx_19_, lean_object* v_t_20_, lean_object* v_h_21_, lean_object* v_k_22_){
_start:
{
uint8_t v_t_boxed_23_; lean_object* v_res_24_; 
v_t_boxed_23_ = lean_unbox(v_t_20_);
v_res_24_ = lp_puzzle_Puzzle_Color_ctorElim(v_motive_18_, v_ctorIdx_19_, v_t_boxed_23_, v_h_21_, v_k_22_);
lean_dec(v_k_22_);
lean_dec(v_ctorIdx_19_);
return v_res_24_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_blue_elim___redArg(lean_object* v_blue_25_){
_start:
{
lean_inc(v_blue_25_);
return v_blue_25_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_blue_elim___redArg___boxed(lean_object* v_blue_26_){
_start:
{
lean_object* v_res_27_; 
v_res_27_ = lp_puzzle_Puzzle_Color_blue_elim___redArg(v_blue_26_);
lean_dec(v_blue_26_);
return v_res_27_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_blue_elim(lean_object* v_motive_28_, uint8_t v_t_29_, lean_object* v_h_30_, lean_object* v_blue_31_){
_start:
{
lean_inc(v_blue_31_);
return v_blue_31_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_blue_elim___boxed(lean_object* v_motive_32_, lean_object* v_t_33_, lean_object* v_h_34_, lean_object* v_blue_35_){
_start:
{
uint8_t v_t_boxed_36_; lean_object* v_res_37_; 
v_t_boxed_36_ = lean_unbox(v_t_33_);
v_res_37_ = lp_puzzle_Puzzle_Color_blue_elim(v_motive_32_, v_t_boxed_36_, v_h_34_, v_blue_35_);
lean_dec(v_blue_35_);
return v_res_37_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_green_elim___redArg(lean_object* v_green_38_){
_start:
{
lean_inc(v_green_38_);
return v_green_38_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_green_elim___redArg___boxed(lean_object* v_green_39_){
_start:
{
lean_object* v_res_40_; 
v_res_40_ = lp_puzzle_Puzzle_Color_green_elim___redArg(v_green_39_);
lean_dec(v_green_39_);
return v_res_40_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_green_elim(lean_object* v_motive_41_, uint8_t v_t_42_, lean_object* v_h_43_, lean_object* v_green_44_){
_start:
{
lean_inc(v_green_44_);
return v_green_44_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_green_elim___boxed(lean_object* v_motive_45_, lean_object* v_t_46_, lean_object* v_h_47_, lean_object* v_green_48_){
_start:
{
uint8_t v_t_boxed_49_; lean_object* v_res_50_; 
v_t_boxed_49_ = lean_unbox(v_t_46_);
v_res_50_ = lp_puzzle_Puzzle_Color_green_elim(v_motive_45_, v_t_boxed_49_, v_h_47_, v_green_48_);
lean_dec(v_green_48_);
return v_res_50_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_red_elim___redArg(lean_object* v_red_51_){
_start:
{
lean_inc(v_red_51_);
return v_red_51_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_red_elim___redArg___boxed(lean_object* v_red_52_){
_start:
{
lean_object* v_res_53_; 
v_res_53_ = lp_puzzle_Puzzle_Color_red_elim___redArg(v_red_52_);
lean_dec(v_red_52_);
return v_res_53_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_red_elim(lean_object* v_motive_54_, uint8_t v_t_55_, lean_object* v_h_56_, lean_object* v_red_57_){
_start:
{
lean_inc(v_red_57_);
return v_red_57_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_red_elim___boxed(lean_object* v_motive_58_, lean_object* v_t_59_, lean_object* v_h_60_, lean_object* v_red_61_){
_start:
{
uint8_t v_t_boxed_62_; lean_object* v_res_63_; 
v_t_boxed_62_ = lean_unbox(v_t_59_);
v_res_63_ = lp_puzzle_Puzzle_Color_red_elim(v_motive_58_, v_t_boxed_62_, v_h_60_, v_red_61_);
lean_dec(v_red_61_);
return v_res_63_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_yellow_elim___redArg(lean_object* v_yellow_64_){
_start:
{
lean_inc(v_yellow_64_);
return v_yellow_64_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_yellow_elim___redArg___boxed(lean_object* v_yellow_65_){
_start:
{
lean_object* v_res_66_; 
v_res_66_ = lp_puzzle_Puzzle_Color_yellow_elim___redArg(v_yellow_65_);
lean_dec(v_yellow_65_);
return v_res_66_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_yellow_elim(lean_object* v_motive_67_, uint8_t v_t_68_, lean_object* v_h_69_, lean_object* v_yellow_70_){
_start:
{
lean_inc(v_yellow_70_);
return v_yellow_70_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_yellow_elim___boxed(lean_object* v_motive_71_, lean_object* v_t_72_, lean_object* v_h_73_, lean_object* v_yellow_74_){
_start:
{
uint8_t v_t_boxed_75_; lean_object* v_res_76_; 
v_t_boxed_75_ = lean_unbox(v_t_72_);
v_res_76_ = lp_puzzle_Puzzle_Color_yellow_elim(v_motive_71_, v_t_boxed_75_, v_h_73_, v_yellow_74_);
lean_dec(v_yellow_74_);
return v_res_76_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_purple_elim___redArg(lean_object* v_purple_77_){
_start:
{
lean_inc(v_purple_77_);
return v_purple_77_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_purple_elim___redArg___boxed(lean_object* v_purple_78_){
_start:
{
lean_object* v_res_79_; 
v_res_79_ = lp_puzzle_Puzzle_Color_purple_elim___redArg(v_purple_78_);
lean_dec(v_purple_78_);
return v_res_79_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_purple_elim(lean_object* v_motive_80_, uint8_t v_t_81_, lean_object* v_h_82_, lean_object* v_purple_83_){
_start:
{
lean_inc(v_purple_83_);
return v_purple_83_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_purple_elim___boxed(lean_object* v_motive_84_, lean_object* v_t_85_, lean_object* v_h_86_, lean_object* v_purple_87_){
_start:
{
uint8_t v_t_boxed_88_; lean_object* v_res_89_; 
v_t_boxed_88_ = lean_unbox(v_t_85_);
v_res_89_ = lp_puzzle_Puzzle_Color_purple_elim(v_motive_84_, v_t_boxed_88_, v_h_86_, v_purple_87_);
lean_dec(v_purple_87_);
return v_res_89_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_Color_ofNat(lean_object* v_n_90_){
_start:
{
lean_object* v___x_91_; uint8_t v___x_92_; 
v___x_91_ = lean_unsigned_to_nat(1u);
v___x_92_ = lean_nat_dec_le(v_n_90_, v___x_91_);
if (v___x_92_ == 0)
{
lean_object* v___x_93_; uint8_t v___x_94_; 
v___x_93_ = lean_unsigned_to_nat(2u);
v___x_94_ = lean_nat_dec_le(v_n_90_, v___x_93_);
if (v___x_94_ == 0)
{
lean_object* v___x_95_; uint8_t v___x_96_; 
v___x_95_ = lean_unsigned_to_nat(3u);
v___x_96_ = lean_nat_dec_le(v_n_90_, v___x_95_);
if (v___x_96_ == 0)
{
uint8_t v___x_97_; 
v___x_97_ = 4;
return v___x_97_;
}
else
{
uint8_t v___x_98_; 
v___x_98_ = 3;
return v___x_98_;
}
}
else
{
uint8_t v___x_99_; 
v___x_99_ = 2;
return v___x_99_;
}
}
else
{
lean_object* v___x_100_; uint8_t v___x_101_; 
v___x_100_ = lean_unsigned_to_nat(0u);
v___x_101_ = lean_nat_dec_le(v_n_90_, v___x_100_);
if (v___x_101_ == 0)
{
uint8_t v___x_102_; 
v___x_102_ = 1;
return v___x_102_;
}
else
{
uint8_t v___x_103_; 
v___x_103_ = 0;
return v___x_103_;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_ofNat___boxed(lean_object* v_n_104_){
_start:
{
uint8_t v_res_105_; lean_object* v_r_106_; 
v_res_105_ = lp_puzzle_Puzzle_Color_ofNat(v_n_104_);
lean_dec(v_n_104_);
v_r_106_ = lean_box(v_res_105_);
return v_r_106_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_instDecidableEqColor(uint8_t v_x_107_, uint8_t v_y_108_){
_start:
{
lean_object* v___x_109_; lean_object* v___x_110_; uint8_t v___x_111_; 
v___x_109_ = lp_puzzle_Puzzle_Color_ctorIdx(v_x_107_);
v___x_110_ = lp_puzzle_Puzzle_Color_ctorIdx(v_y_108_);
v___x_111_ = lean_nat_dec_eq(v___x_109_, v___x_110_);
lean_dec(v___x_110_);
lean_dec(v___x_109_);
return v___x_111_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instDecidableEqColor___boxed(lean_object* v_x_112_, lean_object* v_y_113_){
_start:
{
uint8_t v_x_20__boxed_114_; uint8_t v_y_21__boxed_115_; uint8_t v_res_116_; lean_object* v_r_117_; 
v_x_20__boxed_114_ = lean_unbox(v_x_112_);
v_y_21__boxed_115_ = lean_unbox(v_y_113_);
v_res_116_ = lp_puzzle_Puzzle_instDecidableEqColor(v_x_20__boxed_114_, v_y_21__boxed_115_);
v_r_117_ = lean_box(v_res_116_);
return v_r_117_;
}
}
static lean_object* _init_lp_puzzle_Puzzle_instReprColor_repr___closed__10(void){
_start:
{
lean_object* v___x_133_; lean_object* v___x_134_; 
v___x_133_ = lean_unsigned_to_nat(2u);
v___x_134_ = lean_nat_to_int(v___x_133_);
return v___x_134_;
}
}
static lean_object* _init_lp_puzzle_Puzzle_instReprColor_repr___closed__11(void){
_start:
{
lean_object* v___x_135_; lean_object* v___x_136_; 
v___x_135_ = lean_unsigned_to_nat(1u);
v___x_136_ = lean_nat_to_int(v___x_135_);
return v___x_136_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instReprColor_repr(uint8_t v_x_137_, lean_object* v_prec_138_){
_start:
{
lean_object* v___y_140_; lean_object* v___y_147_; lean_object* v___y_154_; lean_object* v___y_161_; lean_object* v___y_168_; 
switch(v_x_137_)
{
case 0:
{
lean_object* v___x_174_; uint8_t v___x_175_; 
v___x_174_ = lean_unsigned_to_nat(1024u);
v___x_175_ = lean_nat_dec_le(v___x_174_, v_prec_138_);
if (v___x_175_ == 0)
{
lean_object* v___x_176_; 
v___x_176_ = lean_obj_once(&lp_puzzle_Puzzle_instReprColor_repr___closed__10, &lp_puzzle_Puzzle_instReprColor_repr___closed__10_once, _init_lp_puzzle_Puzzle_instReprColor_repr___closed__10);
v___y_140_ = v___x_176_;
goto v___jp_139_;
}
else
{
lean_object* v___x_177_; 
v___x_177_ = lean_obj_once(&lp_puzzle_Puzzle_instReprColor_repr___closed__11, &lp_puzzle_Puzzle_instReprColor_repr___closed__11_once, _init_lp_puzzle_Puzzle_instReprColor_repr___closed__11);
v___y_140_ = v___x_177_;
goto v___jp_139_;
}
}
case 1:
{
lean_object* v___x_178_; uint8_t v___x_179_; 
v___x_178_ = lean_unsigned_to_nat(1024u);
v___x_179_ = lean_nat_dec_le(v___x_178_, v_prec_138_);
if (v___x_179_ == 0)
{
lean_object* v___x_180_; 
v___x_180_ = lean_obj_once(&lp_puzzle_Puzzle_instReprColor_repr___closed__10, &lp_puzzle_Puzzle_instReprColor_repr___closed__10_once, _init_lp_puzzle_Puzzle_instReprColor_repr___closed__10);
v___y_147_ = v___x_180_;
goto v___jp_146_;
}
else
{
lean_object* v___x_181_; 
v___x_181_ = lean_obj_once(&lp_puzzle_Puzzle_instReprColor_repr___closed__11, &lp_puzzle_Puzzle_instReprColor_repr___closed__11_once, _init_lp_puzzle_Puzzle_instReprColor_repr___closed__11);
v___y_147_ = v___x_181_;
goto v___jp_146_;
}
}
case 2:
{
lean_object* v___x_182_; uint8_t v___x_183_; 
v___x_182_ = lean_unsigned_to_nat(1024u);
v___x_183_ = lean_nat_dec_le(v___x_182_, v_prec_138_);
if (v___x_183_ == 0)
{
lean_object* v___x_184_; 
v___x_184_ = lean_obj_once(&lp_puzzle_Puzzle_instReprColor_repr___closed__10, &lp_puzzle_Puzzle_instReprColor_repr___closed__10_once, _init_lp_puzzle_Puzzle_instReprColor_repr___closed__10);
v___y_154_ = v___x_184_;
goto v___jp_153_;
}
else
{
lean_object* v___x_185_; 
v___x_185_ = lean_obj_once(&lp_puzzle_Puzzle_instReprColor_repr___closed__11, &lp_puzzle_Puzzle_instReprColor_repr___closed__11_once, _init_lp_puzzle_Puzzle_instReprColor_repr___closed__11);
v___y_154_ = v___x_185_;
goto v___jp_153_;
}
}
case 3:
{
lean_object* v___x_186_; uint8_t v___x_187_; 
v___x_186_ = lean_unsigned_to_nat(1024u);
v___x_187_ = lean_nat_dec_le(v___x_186_, v_prec_138_);
if (v___x_187_ == 0)
{
lean_object* v___x_188_; 
v___x_188_ = lean_obj_once(&lp_puzzle_Puzzle_instReprColor_repr___closed__10, &lp_puzzle_Puzzle_instReprColor_repr___closed__10_once, _init_lp_puzzle_Puzzle_instReprColor_repr___closed__10);
v___y_161_ = v___x_188_;
goto v___jp_160_;
}
else
{
lean_object* v___x_189_; 
v___x_189_ = lean_obj_once(&lp_puzzle_Puzzle_instReprColor_repr___closed__11, &lp_puzzle_Puzzle_instReprColor_repr___closed__11_once, _init_lp_puzzle_Puzzle_instReprColor_repr___closed__11);
v___y_161_ = v___x_189_;
goto v___jp_160_;
}
}
default: 
{
lean_object* v___x_190_; uint8_t v___x_191_; 
v___x_190_ = lean_unsigned_to_nat(1024u);
v___x_191_ = lean_nat_dec_le(v___x_190_, v_prec_138_);
if (v___x_191_ == 0)
{
lean_object* v___x_192_; 
v___x_192_ = lean_obj_once(&lp_puzzle_Puzzle_instReprColor_repr___closed__10, &lp_puzzle_Puzzle_instReprColor_repr___closed__10_once, _init_lp_puzzle_Puzzle_instReprColor_repr___closed__10);
v___y_168_ = v___x_192_;
goto v___jp_167_;
}
else
{
lean_object* v___x_193_; 
v___x_193_ = lean_obj_once(&lp_puzzle_Puzzle_instReprColor_repr___closed__11, &lp_puzzle_Puzzle_instReprColor_repr___closed__11_once, _init_lp_puzzle_Puzzle_instReprColor_repr___closed__11);
v___y_168_ = v___x_193_;
goto v___jp_167_;
}
}
}
v___jp_139_:
{
lean_object* v___x_141_; lean_object* v___x_142_; uint8_t v___x_143_; lean_object* v___x_144_; lean_object* v___x_145_; 
v___x_141_ = ((lean_object*)(lp_puzzle_Puzzle_instReprColor_repr___closed__1));
lean_inc(v___y_140_);
v___x_142_ = lean_alloc_ctor(4, 2, 0);
lean_ctor_set(v___x_142_, 0, v___y_140_);
lean_ctor_set(v___x_142_, 1, v___x_141_);
v___x_143_ = 0;
v___x_144_ = lean_alloc_ctor(6, 1, 1);
lean_ctor_set(v___x_144_, 0, v___x_142_);
lean_ctor_set_uint8(v___x_144_, sizeof(void*)*1, v___x_143_);
v___x_145_ = l_Repr_addAppParen(v___x_144_, v_prec_138_);
return v___x_145_;
}
v___jp_146_:
{
lean_object* v___x_148_; lean_object* v___x_149_; uint8_t v___x_150_; lean_object* v___x_151_; lean_object* v___x_152_; 
v___x_148_ = ((lean_object*)(lp_puzzle_Puzzle_instReprColor_repr___closed__3));
lean_inc(v___y_147_);
v___x_149_ = lean_alloc_ctor(4, 2, 0);
lean_ctor_set(v___x_149_, 0, v___y_147_);
lean_ctor_set(v___x_149_, 1, v___x_148_);
v___x_150_ = 0;
v___x_151_ = lean_alloc_ctor(6, 1, 1);
lean_ctor_set(v___x_151_, 0, v___x_149_);
lean_ctor_set_uint8(v___x_151_, sizeof(void*)*1, v___x_150_);
v___x_152_ = l_Repr_addAppParen(v___x_151_, v_prec_138_);
return v___x_152_;
}
v___jp_153_:
{
lean_object* v___x_155_; lean_object* v___x_156_; uint8_t v___x_157_; lean_object* v___x_158_; lean_object* v___x_159_; 
v___x_155_ = ((lean_object*)(lp_puzzle_Puzzle_instReprColor_repr___closed__5));
lean_inc(v___y_154_);
v___x_156_ = lean_alloc_ctor(4, 2, 0);
lean_ctor_set(v___x_156_, 0, v___y_154_);
lean_ctor_set(v___x_156_, 1, v___x_155_);
v___x_157_ = 0;
v___x_158_ = lean_alloc_ctor(6, 1, 1);
lean_ctor_set(v___x_158_, 0, v___x_156_);
lean_ctor_set_uint8(v___x_158_, sizeof(void*)*1, v___x_157_);
v___x_159_ = l_Repr_addAppParen(v___x_158_, v_prec_138_);
return v___x_159_;
}
v___jp_160_:
{
lean_object* v___x_162_; lean_object* v___x_163_; uint8_t v___x_164_; lean_object* v___x_165_; lean_object* v___x_166_; 
v___x_162_ = ((lean_object*)(lp_puzzle_Puzzle_instReprColor_repr___closed__7));
lean_inc(v___y_161_);
v___x_163_ = lean_alloc_ctor(4, 2, 0);
lean_ctor_set(v___x_163_, 0, v___y_161_);
lean_ctor_set(v___x_163_, 1, v___x_162_);
v___x_164_ = 0;
v___x_165_ = lean_alloc_ctor(6, 1, 1);
lean_ctor_set(v___x_165_, 0, v___x_163_);
lean_ctor_set_uint8(v___x_165_, sizeof(void*)*1, v___x_164_);
v___x_166_ = l_Repr_addAppParen(v___x_165_, v_prec_138_);
return v___x_166_;
}
v___jp_167_:
{
lean_object* v___x_169_; lean_object* v___x_170_; uint8_t v___x_171_; lean_object* v___x_172_; lean_object* v___x_173_; 
v___x_169_ = ((lean_object*)(lp_puzzle_Puzzle_instReprColor_repr___closed__9));
lean_inc(v___y_168_);
v___x_170_ = lean_alloc_ctor(4, 2, 0);
lean_ctor_set(v___x_170_, 0, v___y_168_);
lean_ctor_set(v___x_170_, 1, v___x_169_);
v___x_171_ = 0;
v___x_172_ = lean_alloc_ctor(6, 1, 1);
lean_ctor_set(v___x_172_, 0, v___x_170_);
lean_ctor_set_uint8(v___x_172_, sizeof(void*)*1, v___x_171_);
v___x_173_ = l_Repr_addAppParen(v___x_172_, v_prec_138_);
return v___x_173_;
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instReprColor_repr___boxed(lean_object* v_x_194_, lean_object* v_prec_195_){
_start:
{
uint8_t v_x_279__boxed_196_; lean_object* v_res_197_; 
v_x_279__boxed_196_ = lean_unbox(v_x_194_);
v_res_197_ = lp_puzzle_Puzzle_instReprColor_repr(v_x_279__boxed_196_, v_prec_195_);
lean_dec(v_prec_195_);
return v_res_197_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_name(uint8_t v_x_205_){
_start:
{
switch(v_x_205_)
{
case 0:
{
lean_object* v___x_206_; 
v___x_206_ = ((lean_object*)(lp_puzzle_Puzzle_Color_name___closed__0));
return v___x_206_;
}
case 1:
{
lean_object* v___x_207_; 
v___x_207_ = ((lean_object*)(lp_puzzle_Puzzle_Color_name___closed__1));
return v___x_207_;
}
case 2:
{
lean_object* v___x_208_; 
v___x_208_ = ((lean_object*)(lp_puzzle_Puzzle_Color_name___closed__2));
return v___x_208_;
}
case 3:
{
lean_object* v___x_209_; 
v___x_209_ = ((lean_object*)(lp_puzzle_Puzzle_Color_name___closed__3));
return v___x_209_;
}
default: 
{
lean_object* v___x_210_; 
v___x_210_ = ((lean_object*)(lp_puzzle_Puzzle_Color_name___closed__4));
return v___x_210_;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Color_name___boxed(lean_object* v_x_211_){
_start:
{
uint8_t v_x_49__boxed_212_; lean_object* v_res_213_; 
v_x_49__boxed_212_ = lean_unbox(v_x_211_);
v_res_213_ = lp_puzzle_Puzzle_Color_name(v_x_49__boxed_212_);
return v_res_213_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_instDecidableEqCell_decEq(lean_object* v_x_214_, lean_object* v_x_215_){
_start:
{
uint8_t v_color_216_; lean_object* v_rot_217_; uint8_t v_color_218_; lean_object* v_rot_219_; lean_object* v___x_220_; lean_object* v___x_221_; uint8_t v___x_222_; 
v_color_216_ = lean_ctor_get_uint8(v_x_214_, sizeof(void*)*1);
v_rot_217_ = lean_ctor_get(v_x_214_, 0);
lean_inc(v_rot_217_);
lean_dec_ref(v_x_214_);
v_color_218_ = lean_ctor_get_uint8(v_x_215_, sizeof(void*)*1);
v_rot_219_ = lean_ctor_get(v_x_215_, 0);
lean_inc(v_rot_219_);
lean_dec_ref(v_x_215_);
v___x_220_ = lp_puzzle_Puzzle_Color_ctorIdx(v_color_216_);
v___x_221_ = lp_puzzle_Puzzle_Color_ctorIdx(v_color_218_);
v___x_222_ = lean_nat_dec_eq(v___x_220_, v___x_221_);
lean_dec(v___x_221_);
lean_dec(v___x_220_);
if (v___x_222_ == 0)
{
lean_dec(v_rot_219_);
lean_dec(v_rot_217_);
return v___x_222_;
}
else
{
lean_object* v___x_223_; uint8_t v___x_224_; 
v___x_223_ = lean_alloc_closure((void*)(l_instDecidableEqNat___boxed), 2, 0);
v___x_224_ = l_Option_instDecidableEq___redArg(v___x_223_, v_rot_217_, v_rot_219_);
return v___x_224_;
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instDecidableEqCell_decEq___boxed(lean_object* v_x_225_, lean_object* v_x_226_){
_start:
{
uint8_t v_res_227_; lean_object* v_r_228_; 
v_res_227_ = lp_puzzle_Puzzle_instDecidableEqCell_decEq(v_x_225_, v_x_226_);
v_r_228_ = lean_box(v_res_227_);
return v_r_228_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_instDecidableEqCell(lean_object* v_x_229_, lean_object* v_x_230_){
_start:
{
uint8_t v___x_231_; 
v___x_231_ = lp_puzzle_Puzzle_instDecidableEqCell_decEq(v_x_229_, v_x_230_);
return v___x_231_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instDecidableEqCell___boxed(lean_object* v_x_232_, lean_object* v_x_233_){
_start:
{
uint8_t v_res_234_; lean_object* v_r_235_; 
v_res_234_ = lp_puzzle_Puzzle_instDecidableEqCell(v_x_232_, v_x_233_);
v_r_235_ = lean_box(v_res_234_);
return v_r_235_;
}
}
static lean_object* _init_lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__7(void){
_start:
{
lean_object* v___x_249_; lean_object* v___x_250_; 
v___x_249_ = lean_unsigned_to_nat(9u);
v___x_250_ = lean_nat_to_int(v___x_249_);
return v___x_250_;
}
}
static lean_object* _init_lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__12(void){
_start:
{
lean_object* v___x_257_; lean_object* v___x_258_; 
v___x_257_ = lean_unsigned_to_nat(7u);
v___x_258_ = lean_nat_to_int(v___x_257_);
return v___x_258_;
}
}
static lean_object* _init_lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__14(void){
_start:
{
lean_object* v___x_260_; lean_object* v___x_261_; 
v___x_260_ = ((lean_object*)(lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__0));
v___x_261_ = lean_string_length(v___x_260_);
return v___x_261_;
}
}
static lean_object* _init_lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__15(void){
_start:
{
lean_object* v___x_262_; lean_object* v___x_263_; 
v___x_262_ = lean_obj_once(&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__14, &lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__14_once, _init_lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__14);
v___x_263_ = lean_nat_to_int(v___x_262_);
return v___x_263_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instReprCell_repr___redArg(lean_object* v_x_268_){
_start:
{
uint8_t v_color_269_; lean_object* v_rot_270_; lean_object* v___x_272_; uint8_t v_isShared_273_; uint8_t v_isSharedCheck_304_; 
v_color_269_ = lean_ctor_get_uint8(v_x_268_, sizeof(void*)*1);
v_rot_270_ = lean_ctor_get(v_x_268_, 0);
v_isSharedCheck_304_ = !lean_is_exclusive(v_x_268_);
if (v_isSharedCheck_304_ == 0)
{
v___x_272_ = v_x_268_;
v_isShared_273_ = v_isSharedCheck_304_;
goto v_resetjp_271_;
}
else
{
lean_inc(v_rot_270_);
lean_dec(v_x_268_);
v___x_272_ = lean_box(0);
v_isShared_273_ = v_isSharedCheck_304_;
goto v_resetjp_271_;
}
v_resetjp_271_:
{
lean_object* v___x_274_; lean_object* v___x_275_; lean_object* v___x_276_; lean_object* v___x_277_; lean_object* v___x_278_; lean_object* v___x_279_; uint8_t v___x_280_; lean_object* v___x_282_; 
v___x_274_ = ((lean_object*)(lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__5));
v___x_275_ = ((lean_object*)(lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__6));
v___x_276_ = lean_obj_once(&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__7, &lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__7_once, _init_lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__7);
v___x_277_ = lean_unsigned_to_nat(0u);
v___x_278_ = lp_puzzle_Puzzle_instReprColor_repr(v_color_269_, v___x_277_);
v___x_279_ = lean_alloc_ctor(4, 2, 0);
lean_ctor_set(v___x_279_, 0, v___x_276_);
lean_ctor_set(v___x_279_, 1, v___x_278_);
v___x_280_ = 0;
if (v_isShared_273_ == 0)
{
lean_ctor_set_tag(v___x_272_, 6);
lean_ctor_set(v___x_272_, 0, v___x_279_);
v___x_282_ = v___x_272_;
goto v_reusejp_281_;
}
else
{
lean_object* v_reuseFailAlloc_303_; 
v_reuseFailAlloc_303_ = lean_alloc_ctor(6, 1, 1);
lean_ctor_set(v_reuseFailAlloc_303_, 0, v___x_279_);
v___x_282_ = v_reuseFailAlloc_303_;
goto v_reusejp_281_;
}
v_reusejp_281_:
{
lean_object* v___x_283_; lean_object* v___x_284_; lean_object* v___x_285_; lean_object* v___x_286_; lean_object* v___x_287_; lean_object* v___x_288_; lean_object* v___x_289_; lean_object* v___x_290_; lean_object* v___x_291_; lean_object* v___x_292_; lean_object* v___x_293_; lean_object* v___x_294_; lean_object* v___x_295_; lean_object* v___x_296_; lean_object* v___x_297_; lean_object* v___x_298_; lean_object* v___x_299_; lean_object* v___x_300_; lean_object* v___x_301_; lean_object* v___x_302_; 
lean_ctor_set_uint8(v___x_282_, sizeof(void*)*1, v___x_280_);
v___x_283_ = lean_alloc_ctor(5, 2, 0);
lean_ctor_set(v___x_283_, 0, v___x_275_);
lean_ctor_set(v___x_283_, 1, v___x_282_);
v___x_284_ = ((lean_object*)(lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__9));
v___x_285_ = lean_alloc_ctor(5, 2, 0);
lean_ctor_set(v___x_285_, 0, v___x_283_);
lean_ctor_set(v___x_285_, 1, v___x_284_);
v___x_286_ = lean_box(1);
v___x_287_ = lean_alloc_ctor(5, 2, 0);
lean_ctor_set(v___x_287_, 0, v___x_285_);
lean_ctor_set(v___x_287_, 1, v___x_286_);
v___x_288_ = ((lean_object*)(lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__11));
v___x_289_ = lean_alloc_ctor(5, 2, 0);
lean_ctor_set(v___x_289_, 0, v___x_287_);
lean_ctor_set(v___x_289_, 1, v___x_288_);
v___x_290_ = lean_alloc_ctor(5, 2, 0);
lean_ctor_set(v___x_290_, 0, v___x_289_);
lean_ctor_set(v___x_290_, 1, v___x_274_);
v___x_291_ = lean_obj_once(&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__12, &lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__12_once, _init_lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__12);
v___x_292_ = l_Option_repr___at___00Lean_Meta_instReprConfig__1_repr_spec__0(v_rot_270_, v___x_277_);
v___x_293_ = lean_alloc_ctor(4, 2, 0);
lean_ctor_set(v___x_293_, 0, v___x_291_);
lean_ctor_set(v___x_293_, 1, v___x_292_);
v___x_294_ = lean_alloc_ctor(6, 1, 1);
lean_ctor_set(v___x_294_, 0, v___x_293_);
lean_ctor_set_uint8(v___x_294_, sizeof(void*)*1, v___x_280_);
v___x_295_ = lean_alloc_ctor(5, 2, 0);
lean_ctor_set(v___x_295_, 0, v___x_290_);
lean_ctor_set(v___x_295_, 1, v___x_294_);
v___x_296_ = lean_obj_once(&lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__15, &lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__15_once, _init_lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__15);
v___x_297_ = ((lean_object*)(lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__16));
v___x_298_ = lean_alloc_ctor(5, 2, 0);
lean_ctor_set(v___x_298_, 0, v___x_297_);
lean_ctor_set(v___x_298_, 1, v___x_295_);
v___x_299_ = ((lean_object*)(lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__17));
v___x_300_ = lean_alloc_ctor(5, 2, 0);
lean_ctor_set(v___x_300_, 0, v___x_298_);
lean_ctor_set(v___x_300_, 1, v___x_299_);
v___x_301_ = lean_alloc_ctor(4, 2, 0);
lean_ctor_set(v___x_301_, 0, v___x_296_);
lean_ctor_set(v___x_301_, 1, v___x_300_);
v___x_302_ = lean_alloc_ctor(6, 1, 1);
lean_ctor_set(v___x_302_, 0, v___x_301_);
lean_ctor_set_uint8(v___x_302_, sizeof(void*)*1, v___x_280_);
return v___x_302_;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instReprCell_repr(lean_object* v_x_305_, lean_object* v_prec_306_){
_start:
{
lean_object* v___x_307_; 
v___x_307_ = lp_puzzle_Puzzle_instReprCell_repr___redArg(v_x_305_);
return v___x_307_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_instReprCell_repr___boxed(lean_object* v_x_308_, lean_object* v_prec_309_){
_start:
{
lean_object* v_res_310_; 
v_res_310_ = lp_puzzle_Puzzle_instReprCell_repr(v_x_308_, v_prec_309_);
lean_dec(v_prec_309_);
return v_res_310_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_ctorIdx(lean_object* v_x_313_){
_start:
{
switch(lean_obj_tag(v_x_313_))
{
case 0:
{
lean_object* v___x_314_; 
v___x_314_ = lean_unsigned_to_nat(0u);
return v___x_314_;
}
case 1:
{
lean_object* v___x_315_; 
v___x_315_ = lean_unsigned_to_nat(1u);
return v___x_315_;
}
default: 
{
lean_object* v___x_316_; 
v___x_316_ = lean_unsigned_to_nat(2u);
return v___x_316_;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_ctorIdx___boxed(lean_object* v_x_317_){
_start:
{
lean_object* v_res_318_; 
v_res_318_ = lp_puzzle_Puzzle_Op_ctorIdx(v_x_317_);
lean_dec_ref(v_x_317_);
return v_res_318_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_ctorElim___redArg(lean_object* v_t_319_, lean_object* v_k_320_){
_start:
{
switch(lean_obj_tag(v_t_319_))
{
case 0:
{
lean_object* v_x1_321_; lean_object* v_y1_322_; lean_object* v_x2_323_; lean_object* v_y2_324_; lean_object* v___x_325_; 
v_x1_321_ = lean_ctor_get(v_t_319_, 0);
lean_inc(v_x1_321_);
v_y1_322_ = lean_ctor_get(v_t_319_, 1);
lean_inc(v_y1_322_);
v_x2_323_ = lean_ctor_get(v_t_319_, 2);
lean_inc(v_x2_323_);
v_y2_324_ = lean_ctor_get(v_t_319_, 3);
lean_inc(v_y2_324_);
lean_dec_ref_known(v_t_319_, 4);
v___x_325_ = lean_apply_4(v_k_320_, v_x1_321_, v_y1_322_, v_x2_323_, v_y2_324_);
return v___x_325_;
}
case 1:
{
lean_object* v_x_326_; lean_object* v_y_327_; uint8_t v_c_328_; lean_object* v___x_329_; lean_object* v___x_330_; 
v_x_326_ = lean_ctor_get(v_t_319_, 0);
lean_inc(v_x_326_);
v_y_327_ = lean_ctor_get(v_t_319_, 1);
lean_inc(v_y_327_);
v_c_328_ = lean_ctor_get_uint8(v_t_319_, sizeof(void*)*2);
lean_dec_ref_known(v_t_319_, 2);
v___x_329_ = lean_box(v_c_328_);
v___x_330_ = lean_apply_3(v_k_320_, v_x_326_, v_y_327_, v___x_329_);
return v___x_330_;
}
default: 
{
lean_object* v_x_331_; lean_object* v_y_332_; lean_object* v___x_333_; 
v_x_331_ = lean_ctor_get(v_t_319_, 0);
lean_inc(v_x_331_);
v_y_332_ = lean_ctor_get(v_t_319_, 1);
lean_inc(v_y_332_);
lean_dec_ref_known(v_t_319_, 2);
v___x_333_ = lean_apply_2(v_k_320_, v_x_331_, v_y_332_);
return v___x_333_;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_ctorElim(lean_object* v_motive_334_, lean_object* v_ctorIdx_335_, lean_object* v_t_336_, lean_object* v_h_337_, lean_object* v_k_338_){
_start:
{
lean_object* v___x_339_; 
v___x_339_ = lp_puzzle_Puzzle_Op_ctorElim___redArg(v_t_336_, v_k_338_);
return v___x_339_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_ctorElim___boxed(lean_object* v_motive_340_, lean_object* v_ctorIdx_341_, lean_object* v_t_342_, lean_object* v_h_343_, lean_object* v_k_344_){
_start:
{
lean_object* v_res_345_; 
v_res_345_ = lp_puzzle_Puzzle_Op_ctorElim(v_motive_340_, v_ctorIdx_341_, v_t_342_, v_h_343_, v_k_344_);
lean_dec(v_ctorIdx_341_);
return v_res_345_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_swap_elim___redArg(lean_object* v_t_346_, lean_object* v_swap_347_){
_start:
{
lean_object* v___x_348_; 
v___x_348_ = lp_puzzle_Puzzle_Op_ctorElim___redArg(v_t_346_, v_swap_347_);
return v___x_348_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_swap_elim(lean_object* v_motive_349_, lean_object* v_t_350_, lean_object* v_h_351_, lean_object* v_swap_352_){
_start:
{
lean_object* v___x_353_; 
v___x_353_ = lp_puzzle_Puzzle_Op_ctorElim___redArg(v_t_350_, v_swap_352_);
return v___x_353_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_paint_elim___redArg(lean_object* v_t_354_, lean_object* v_paint_355_){
_start:
{
lean_object* v___x_356_; 
v___x_356_ = lp_puzzle_Puzzle_Op_ctorElim___redArg(v_t_354_, v_paint_355_);
return v___x_356_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_paint_elim(lean_object* v_motive_357_, lean_object* v_t_358_, lean_object* v_h_359_, lean_object* v_paint_360_){
_start:
{
lean_object* v___x_361_; 
v___x_361_ = lp_puzzle_Puzzle_Op_ctorElim___redArg(v_t_358_, v_paint_360_);
return v___x_361_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_rotate_elim___redArg(lean_object* v_t_362_, lean_object* v_rotate_363_){
_start:
{
lean_object* v___x_364_; 
v___x_364_ = lp_puzzle_Puzzle_Op_ctorElim___redArg(v_t_362_, v_rotate_363_);
return v___x_364_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_Op_rotate_elim(lean_object* v_motive_365_, lean_object* v_t_366_, lean_object* v_h_367_, lean_object* v_rotate_368_){
_start:
{
lean_object* v___x_369_; 
v___x_369_ = lp_puzzle_Puzzle_Op_ctorElim___redArg(v_t_366_, v_rotate_368_);
return v___x_369_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_height(lean_object* v_b_374_){
_start:
{
lean_object* v___x_375_; 
v___x_375_ = l_List_lengthTR___redArg(v_b_374_);
return v___x_375_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_height___boxed(lean_object* v_b_376_){
_start:
{
lean_object* v_res_377_; 
v_res_377_ = lp_puzzle_Puzzle_height(v_b_376_);
lean_dec(v_b_376_);
return v_res_377_;
}
}
static lean_object* _init_lp_puzzle_Puzzle_width___closed__0(void){
_start:
{
lean_object* v___x_378_; lean_object* v___x_379_; 
v___x_378_ = lean_box(0);
v___x_379_ = l_List_lengthTR___redArg(v___x_378_);
return v___x_379_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_width(lean_object* v_b_380_){
_start:
{
if (lean_obj_tag(v_b_380_) == 0)
{
lean_object* v___x_381_; 
v___x_381_ = lean_obj_once(&lp_puzzle_Puzzle_width___closed__0, &lp_puzzle_Puzzle_width___closed__0_once, _init_lp_puzzle_Puzzle_width___closed__0);
return v___x_381_;
}
else
{
lean_object* v_head_382_; lean_object* v___x_383_; 
v_head_382_ = lean_ctor_get(v_b_380_, 0);
v___x_383_ = l_List_lengthTR___redArg(v_head_382_);
return v___x_383_;
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_width___boxed(lean_object* v_b_384_){
_start:
{
lean_object* v_res_385_; 
v_res_385_ = lp_puzzle_Puzzle_width(v_b_384_);
lean_dec(v_b_384_);
return v_res_385_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_inside(lean_object* v_b_386_, lean_object* v_p_387_){
_start:
{
lean_object* v_fst_388_; lean_object* v_snd_389_; lean_object* v___x_390_; uint8_t v___x_391_; 
v_fst_388_ = lean_ctor_get(v_p_387_, 0);
v_snd_389_ = lean_ctor_get(v_p_387_, 1);
v___x_390_ = l_List_lengthTR___redArg(v_b_386_);
v___x_391_ = lean_nat_dec_lt(v_snd_389_, v___x_390_);
lean_dec(v___x_390_);
if (v___x_391_ == 0)
{
return v___x_391_;
}
else
{
lean_object* v___x_392_; uint8_t v___x_393_; 
v___x_392_ = lp_puzzle_Puzzle_width(v_b_386_);
v___x_393_ = lean_nat_dec_lt(v_fst_388_, v___x_392_);
lean_dec(v___x_392_);
return v___x_393_;
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_inside___boxed(lean_object* v_b_394_, lean_object* v_p_395_){
_start:
{
uint8_t v_res_396_; lean_object* v_r_397_; 
v_res_396_ = lp_puzzle_Puzzle_inside(v_b_394_, v_p_395_);
lean_dec_ref(v_p_395_);
lean_dec(v_b_394_);
v_r_397_ = lean_box(v_res_396_);
return v_r_397_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_getCell(lean_object* v_b_398_, lean_object* v_x_399_, lean_object* v_y_400_){
_start:
{
lean_object* v___x_401_; lean_object* v___x_402_; lean_object* v___x_403_; lean_object* v___x_404_; 
v___x_401_ = lean_box(0);
v___x_402_ = l_List_getD___redArg(v_b_398_, v_y_400_, v___x_401_);
v___x_403_ = ((lean_object*)(lp_puzzle_Puzzle_blank));
v___x_404_ = l_List_getD___redArg(v___x_402_, v_x_399_, v___x_403_);
lean_dec(v___x_402_);
return v___x_404_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_getCell___boxed(lean_object* v_b_405_, lean_object* v_x_406_, lean_object* v_y_407_){
_start:
{
lean_object* v_res_408_; 
v_res_408_ = lp_puzzle_Puzzle_getCell(v_b_405_, v_x_406_, v_y_407_);
lean_dec(v_b_405_);
return v_res_408_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_setCell(lean_object* v_b_411_, lean_object* v_x_412_, lean_object* v_y_413_, lean_object* v_c_414_){
_start:
{
lean_object* v___x_415_; lean_object* v___x_416_; lean_object* v___x_417_; lean_object* v___x_418_; lean_object* v___x_419_; 
v___x_415_ = lean_box(0);
lean_inc(v_y_413_);
v___x_416_ = l_List_getD___redArg(v_b_411_, v_y_413_, v___x_415_);
v___x_417_ = ((lean_object*)(lp_puzzle_Puzzle_setCell___closed__0));
lean_inc(v___x_416_);
v___x_418_ = l___private_Init_Data_List_Impl_0__List_setTR_go___redArg(v___x_416_, v_c_414_, v___x_416_, v_x_412_, v___x_417_);
lean_dec(v___x_416_);
lean_inc(v_b_411_);
v___x_419_ = l___private_Init_Data_List_Impl_0__List_setTR_go___redArg(v_b_411_, v___x_418_, v_b_411_, v_y_413_, v___x_417_);
lean_dec(v_b_411_);
return v___x_419_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__4(lean_object* v_b_420_, lean_object* v_a_421_, lean_object* v_a_422_){
_start:
{
if (lean_obj_tag(v_a_421_) == 0)
{
lean_object* v___x_423_; 
v___x_423_ = l_List_reverse___redArg(v_a_422_);
return v___x_423_;
}
else
{
lean_object* v_head_424_; lean_object* v_tail_425_; lean_object* v___x_427_; uint8_t v_isShared_428_; uint8_t v_isSharedCheck_435_; 
v_head_424_ = lean_ctor_get(v_a_421_, 0);
v_tail_425_ = lean_ctor_get(v_a_421_, 1);
v_isSharedCheck_435_ = !lean_is_exclusive(v_a_421_);
if (v_isSharedCheck_435_ == 0)
{
v___x_427_ = v_a_421_;
v_isShared_428_ = v_isSharedCheck_435_;
goto v_resetjp_426_;
}
else
{
lean_inc(v_tail_425_);
lean_inc(v_head_424_);
lean_dec(v_a_421_);
v___x_427_ = lean_box(0);
v_isShared_428_ = v_isSharedCheck_435_;
goto v_resetjp_426_;
}
v_resetjp_426_:
{
uint8_t v___x_429_; 
v___x_429_ = lp_puzzle_Puzzle_inside(v_b_420_, v_head_424_);
if (v___x_429_ == 0)
{
lean_del_object(v___x_427_);
lean_dec(v_head_424_);
v_a_421_ = v_tail_425_;
goto _start;
}
else
{
lean_object* v___x_432_; 
if (v_isShared_428_ == 0)
{
lean_ctor_set(v___x_427_, 1, v_a_422_);
v___x_432_ = v___x_427_;
goto v_reusejp_431_;
}
else
{
lean_object* v_reuseFailAlloc_434_; 
v_reuseFailAlloc_434_ = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(v_reuseFailAlloc_434_, 0, v_head_424_);
lean_ctor_set(v_reuseFailAlloc_434_, 1, v_a_422_);
v___x_432_ = v_reuseFailAlloc_434_;
goto v_reusejp_431_;
}
v_reusejp_431_:
{
v_a_421_ = v_tail_425_;
v_a_422_ = v___x_432_;
goto _start;
}
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__4___boxed(lean_object* v_b_436_, lean_object* v_a_437_, lean_object* v_a_438_){
_start:
{
lean_object* v_res_439_; 
v_res_439_ = lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__4(v_b_436_, v_a_437_, v_a_438_);
lean_dec(v_b_436_);
return v_res_439_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_List_elem___at___00Puzzle_check_spec__0(lean_object* v_a_440_, lean_object* v_x_441_){
_start:
{
if (lean_obj_tag(v_x_441_) == 0)
{
uint8_t v___x_442_; 
v___x_442_ = 0;
return v___x_442_;
}
else
{
lean_object* v_head_443_; lean_object* v_tail_444_; lean_object* v_fst_445_; lean_object* v_snd_446_; lean_object* v_fst_447_; lean_object* v_snd_448_; uint8_t v___x_449_; 
v_head_443_ = lean_ctor_get(v_x_441_, 0);
v_tail_444_ = lean_ctor_get(v_x_441_, 1);
v_fst_445_ = lean_ctor_get(v_a_440_, 0);
v_snd_446_ = lean_ctor_get(v_a_440_, 1);
v_fst_447_ = lean_ctor_get(v_head_443_, 0);
v_snd_448_ = lean_ctor_get(v_head_443_, 1);
v___x_449_ = lean_nat_dec_eq(v_fst_445_, v_fst_447_);
if (v___x_449_ == 0)
{
v_x_441_ = v_tail_444_;
goto _start;
}
else
{
uint8_t v___x_451_; 
v___x_451_ = lean_nat_dec_eq(v_snd_446_, v_snd_448_);
if (v___x_451_ == 0)
{
v_x_441_ = v_tail_444_;
goto _start;
}
else
{
return v___x_451_;
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_elem___at___00Puzzle_check_spec__0___boxed(lean_object* v_a_453_, lean_object* v_x_454_){
_start:
{
uint8_t v_res_455_; lean_object* v_r_456_; 
v_res_455_ = lp_puzzle_List_elem___at___00Puzzle_check_spec__0(v_a_453_, v_x_454_);
lean_dec(v_x_454_);
lean_dec_ref(v_a_453_);
v_r_456_ = lean_box(v_res_455_);
return v_r_456_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__3(lean_object* v_locked_457_, lean_object* v_a_458_, lean_object* v_a_459_){
_start:
{
if (lean_obj_tag(v_a_458_) == 0)
{
lean_object* v___x_460_; 
v___x_460_ = l_List_reverse___redArg(v_a_459_);
return v___x_460_;
}
else
{
lean_object* v_head_461_; lean_object* v_tail_462_; lean_object* v___x_464_; uint8_t v_isShared_465_; uint8_t v_isSharedCheck_472_; 
v_head_461_ = lean_ctor_get(v_a_458_, 0);
v_tail_462_ = lean_ctor_get(v_a_458_, 1);
v_isSharedCheck_472_ = !lean_is_exclusive(v_a_458_);
if (v_isSharedCheck_472_ == 0)
{
v___x_464_ = v_a_458_;
v_isShared_465_ = v_isSharedCheck_472_;
goto v_resetjp_463_;
}
else
{
lean_inc(v_tail_462_);
lean_inc(v_head_461_);
lean_dec(v_a_458_);
v___x_464_ = lean_box(0);
v_isShared_465_ = v_isSharedCheck_472_;
goto v_resetjp_463_;
}
v_resetjp_463_:
{
uint8_t v___x_466_; 
v___x_466_ = lp_puzzle_List_elem___at___00Puzzle_check_spec__0(v_head_461_, v_locked_457_);
if (v___x_466_ == 0)
{
lean_del_object(v___x_464_);
lean_dec(v_head_461_);
v_a_458_ = v_tail_462_;
goto _start;
}
else
{
lean_object* v___x_469_; 
if (v_isShared_465_ == 0)
{
lean_ctor_set(v___x_464_, 1, v_a_459_);
v___x_469_ = v___x_464_;
goto v_reusejp_468_;
}
else
{
lean_object* v_reuseFailAlloc_471_; 
v_reuseFailAlloc_471_ = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(v_reuseFailAlloc_471_, 0, v_head_461_);
lean_ctor_set(v_reuseFailAlloc_471_, 1, v_a_459_);
v___x_469_ = v_reuseFailAlloc_471_;
goto v_reusejp_468_;
}
v_reusejp_468_:
{
v_a_458_ = v_tail_462_;
v_a_459_ = v___x_469_;
goto _start;
}
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__3___boxed(lean_object* v_locked_473_, lean_object* v_a_474_, lean_object* v_a_475_){
_start:
{
lean_object* v_res_476_; 
v_res_476_ = lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__3(v_locked_473_, v_a_474_, v_a_475_);
lean_dec(v_locked_473_);
return v_res_476_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__2(lean_object* v_locked_477_, lean_object* v_x_478_){
_start:
{
if (lean_obj_tag(v_x_478_) == 0)
{
lean_object* v___x_479_; 
v___x_479_ = lean_box(0);
return v___x_479_;
}
else
{
lean_object* v_head_480_; lean_object* v_tail_481_; uint8_t v___x_482_; 
v_head_480_ = lean_ctor_get(v_x_478_, 0);
v_tail_481_ = lean_ctor_get(v_x_478_, 1);
v___x_482_ = lp_puzzle_List_elem___at___00Puzzle_check_spec__0(v_head_480_, v_locked_477_);
if (v___x_482_ == 0)
{
v_x_478_ = v_tail_481_;
goto _start;
}
else
{
lean_object* v___x_484_; 
lean_inc(v_head_480_);
v___x_484_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v___x_484_, 0, v_head_480_);
return v___x_484_;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__2___boxed(lean_object* v_locked_485_, lean_object* v_x_486_){
_start:
{
lean_object* v_res_487_; 
v_res_487_ = lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__2(v_locked_485_, v_x_486_);
lean_dec(v_x_486_);
lean_dec(v_locked_485_);
return v_res_487_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__1(lean_object* v_b_488_, lean_object* v_x_489_){
_start:
{
if (lean_obj_tag(v_x_489_) == 0)
{
lean_object* v___x_490_; 
v___x_490_ = lean_box(0);
return v___x_490_;
}
else
{
lean_object* v_head_491_; lean_object* v_tail_492_; uint8_t v___x_493_; 
v_head_491_ = lean_ctor_get(v_x_489_, 0);
v_tail_492_ = lean_ctor_get(v_x_489_, 1);
v___x_493_ = lp_puzzle_Puzzle_inside(v_b_488_, v_head_491_);
if (v___x_493_ == 0)
{
lean_object* v___x_494_; 
lean_inc(v_head_491_);
v___x_494_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v___x_494_, 0, v_head_491_);
return v___x_494_;
}
else
{
v_x_489_ = v_tail_492_;
goto _start;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__1___boxed(lean_object* v_b_496_, lean_object* v_x_497_){
_start:
{
lean_object* v_res_498_; 
v_res_498_ = lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__1(v_b_496_, v_x_497_);
lean_dec(v_x_497_);
lean_dec(v_b_496_);
return v_res_498_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_check(lean_object* v_locked_508_, lean_object* v_b_509_, lean_object* v_pts_510_){
_start:
{
lean_object* v___x_511_; 
v___x_511_ = lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__1(v_b_509_, v_pts_510_);
if (lean_obj_tag(v___x_511_) == 0)
{
lean_object* v___x_512_; 
v___x_512_ = lp_puzzle_List_find_x3f___at___00Puzzle_check_spec__2(v_locked_508_, v_pts_510_);
if (lean_obj_tag(v___x_512_) == 0)
{
lean_object* v___x_513_; 
lean_dec(v_pts_510_);
v___x_513_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__0));
return v___x_513_;
}
else
{
lean_object* v_val_514_; lean_object* v___x_516_; uint8_t v_isShared_517_; uint8_t v_isSharedCheck_541_; 
v_val_514_ = lean_ctor_get(v___x_512_, 0);
v_isSharedCheck_541_ = !lean_is_exclusive(v___x_512_);
if (v_isSharedCheck_541_ == 0)
{
v___x_516_ = v___x_512_;
v_isShared_517_ = v_isSharedCheck_541_;
goto v_resetjp_515_;
}
else
{
lean_inc(v_val_514_);
lean_dec(v___x_512_);
v___x_516_ = lean_box(0);
v_isShared_517_ = v_isSharedCheck_541_;
goto v_resetjp_515_;
}
v_resetjp_515_:
{
lean_object* v_fst_518_; lean_object* v_snd_519_; lean_object* v___x_521_; uint8_t v_isShared_522_; uint8_t v_isSharedCheck_540_; 
v_fst_518_ = lean_ctor_get(v_val_514_, 0);
v_snd_519_ = lean_ctor_get(v_val_514_, 1);
v_isSharedCheck_540_ = !lean_is_exclusive(v_val_514_);
if (v_isSharedCheck_540_ == 0)
{
v___x_521_ = v_val_514_;
v_isShared_522_ = v_isSharedCheck_540_;
goto v_resetjp_520_;
}
else
{
lean_inc(v_snd_519_);
lean_inc(v_fst_518_);
lean_dec(v_val_514_);
v___x_521_ = lean_box(0);
v_isShared_522_ = v_isSharedCheck_540_;
goto v_resetjp_520_;
}
v_resetjp_520_:
{
lean_object* v___x_523_; lean_object* v___x_524_; lean_object* v___x_525_; lean_object* v___x_526_; lean_object* v___x_527_; lean_object* v___x_528_; lean_object* v___x_529_; lean_object* v___x_530_; lean_object* v___x_531_; lean_object* v___x_532_; lean_object* v___x_533_; lean_object* v___x_535_; 
v___x_523_ = lean_box(0);
v___x_524_ = lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__3(v_locked_508_, v_pts_510_, v___x_523_);
v___x_525_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__1));
v___x_526_ = l_Nat_reprFast(v_fst_518_);
v___x_527_ = lean_string_append(v___x_525_, v___x_526_);
lean_dec_ref(v___x_526_);
v___x_528_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__2));
v___x_529_ = lean_string_append(v___x_527_, v___x_528_);
v___x_530_ = l_Nat_reprFast(v_snd_519_);
v___x_531_ = lean_string_append(v___x_529_, v___x_530_);
lean_dec_ref(v___x_530_);
v___x_532_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__3));
v___x_533_ = lean_string_append(v___x_531_, v___x_532_);
if (v_isShared_522_ == 0)
{
lean_ctor_set(v___x_521_, 1, v___x_533_);
lean_ctor_set(v___x_521_, 0, v___x_524_);
v___x_535_ = v___x_521_;
goto v_reusejp_534_;
}
else
{
lean_object* v_reuseFailAlloc_539_; 
v_reuseFailAlloc_539_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v_reuseFailAlloc_539_, 0, v___x_524_);
lean_ctor_set(v_reuseFailAlloc_539_, 1, v___x_533_);
v___x_535_ = v_reuseFailAlloc_539_;
goto v_reusejp_534_;
}
v_reusejp_534_:
{
lean_object* v___x_537_; 
if (v_isShared_517_ == 0)
{
lean_ctor_set_tag(v___x_516_, 0);
lean_ctor_set(v___x_516_, 0, v___x_535_);
v___x_537_ = v___x_516_;
goto v_reusejp_536_;
}
else
{
lean_object* v_reuseFailAlloc_538_; 
v_reuseFailAlloc_538_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v_reuseFailAlloc_538_, 0, v___x_535_);
v___x_537_ = v_reuseFailAlloc_538_;
goto v_reusejp_536_;
}
v_reusejp_536_:
{
return v___x_537_;
}
}
}
}
}
}
else
{
lean_object* v_val_542_; lean_object* v___x_544_; uint8_t v_isShared_545_; uint8_t v_isSharedCheck_579_; 
v_val_542_ = lean_ctor_get(v___x_511_, 0);
v_isSharedCheck_579_ = !lean_is_exclusive(v___x_511_);
if (v_isSharedCheck_579_ == 0)
{
v___x_544_ = v___x_511_;
v_isShared_545_ = v_isSharedCheck_579_;
goto v_resetjp_543_;
}
else
{
lean_inc(v_val_542_);
lean_dec(v___x_511_);
v___x_544_ = lean_box(0);
v_isShared_545_ = v_isSharedCheck_579_;
goto v_resetjp_543_;
}
v_resetjp_543_:
{
lean_object* v_fst_546_; lean_object* v_snd_547_; lean_object* v___x_549_; uint8_t v_isShared_550_; uint8_t v_isSharedCheck_578_; 
v_fst_546_ = lean_ctor_get(v_val_542_, 0);
v_snd_547_ = lean_ctor_get(v_val_542_, 1);
v_isSharedCheck_578_ = !lean_is_exclusive(v_val_542_);
if (v_isSharedCheck_578_ == 0)
{
v___x_549_ = v_val_542_;
v_isShared_550_ = v_isSharedCheck_578_;
goto v_resetjp_548_;
}
else
{
lean_inc(v_snd_547_);
lean_inc(v_fst_546_);
lean_dec(v_val_542_);
v___x_549_ = lean_box(0);
v_isShared_550_ = v_isSharedCheck_578_;
goto v_resetjp_548_;
}
v_resetjp_548_:
{
lean_object* v___x_551_; lean_object* v___x_552_; lean_object* v___x_553_; lean_object* v___x_554_; lean_object* v___x_555_; lean_object* v___x_556_; lean_object* v___x_557_; lean_object* v___x_558_; lean_object* v___x_559_; lean_object* v___x_560_; lean_object* v___x_561_; lean_object* v___x_562_; lean_object* v___x_563_; lean_object* v___x_564_; lean_object* v___x_565_; lean_object* v___x_566_; lean_object* v___x_567_; lean_object* v___x_568_; lean_object* v___x_569_; lean_object* v___x_570_; lean_object* v___x_571_; lean_object* v___x_573_; 
v___x_551_ = lean_box(0);
v___x_552_ = lp_puzzle_List_filterTR_loop___at___00Puzzle_check_spec__4(v_b_509_, v_pts_510_, v___x_551_);
v___x_553_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__4));
v___x_554_ = l_Nat_reprFast(v_fst_546_);
v___x_555_ = lean_string_append(v___x_553_, v___x_554_);
lean_dec_ref(v___x_554_);
v___x_556_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__2));
v___x_557_ = lean_string_append(v___x_555_, v___x_556_);
v___x_558_ = l_Nat_reprFast(v_snd_547_);
v___x_559_ = lean_string_append(v___x_557_, v___x_558_);
lean_dec_ref(v___x_558_);
v___x_560_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__5));
v___x_561_ = lean_string_append(v___x_559_, v___x_560_);
v___x_562_ = lp_puzzle_Puzzle_width(v_b_509_);
v___x_563_ = l_Nat_reprFast(v___x_562_);
v___x_564_ = lean_string_append(v___x_561_, v___x_563_);
lean_dec_ref(v___x_563_);
v___x_565_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__6));
v___x_566_ = lean_string_append(v___x_564_, v___x_565_);
v___x_567_ = l_List_lengthTR___redArg(v_b_509_);
v___x_568_ = l_Nat_reprFast(v___x_567_);
v___x_569_ = lean_string_append(v___x_566_, v___x_568_);
lean_dec_ref(v___x_568_);
v___x_570_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__7));
v___x_571_ = lean_string_append(v___x_569_, v___x_570_);
if (v_isShared_550_ == 0)
{
lean_ctor_set(v___x_549_, 1, v___x_571_);
lean_ctor_set(v___x_549_, 0, v___x_552_);
v___x_573_ = v___x_549_;
goto v_reusejp_572_;
}
else
{
lean_object* v_reuseFailAlloc_577_; 
v_reuseFailAlloc_577_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v_reuseFailAlloc_577_, 0, v___x_552_);
lean_ctor_set(v_reuseFailAlloc_577_, 1, v___x_571_);
v___x_573_ = v_reuseFailAlloc_577_;
goto v_reusejp_572_;
}
v_reusejp_572_:
{
lean_object* v___x_575_; 
if (v_isShared_545_ == 0)
{
lean_ctor_set_tag(v___x_544_, 0);
lean_ctor_set(v___x_544_, 0, v___x_573_);
v___x_575_ = v___x_544_;
goto v_reusejp_574_;
}
else
{
lean_object* v_reuseFailAlloc_576_; 
v_reuseFailAlloc_576_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v_reuseFailAlloc_576_, 0, v___x_573_);
v___x_575_ = v_reuseFailAlloc_576_;
goto v_reusejp_574_;
}
v_reusejp_574_:
{
return v___x_575_;
}
}
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_check___boxed(lean_object* v_locked_580_, lean_object* v_b_581_, lean_object* v_pts_582_){
_start:
{
lean_object* v_res_583_; 
v_res_583_ = lp_puzzle_Puzzle_check(v_locked_580_, v_b_581_, v_pts_582_);
lean_dec(v_b_581_);
lean_dec(v_locked_580_);
return v_res_583_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_apply(lean_object* v_locked_585_, lean_object* v_b_586_, lean_object* v_x_587_){
_start:
{
switch(lean_obj_tag(v_x_587_))
{
case 0:
{
lean_object* v_x1_588_; lean_object* v_y1_589_; lean_object* v_x2_590_; lean_object* v_y2_591_; lean_object* v___x_592_; lean_object* v___x_593_; lean_object* v___x_594_; lean_object* v___x_595_; lean_object* v___x_596_; lean_object* v___x_597_; 
v_x1_588_ = lean_ctor_get(v_x_587_, 0);
lean_inc_n(v_x1_588_, 2);
v_y1_589_ = lean_ctor_get(v_x_587_, 1);
lean_inc_n(v_y1_589_, 2);
v_x2_590_ = lean_ctor_get(v_x_587_, 2);
lean_inc_n(v_x2_590_, 2);
v_y2_591_ = lean_ctor_get(v_x_587_, 3);
lean_inc_n(v_y2_591_, 2);
lean_dec_ref_known(v_x_587_, 4);
v___x_592_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v___x_592_, 0, v_x1_588_);
lean_ctor_set(v___x_592_, 1, v_y1_589_);
v___x_593_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v___x_593_, 0, v_x2_590_);
lean_ctor_set(v___x_593_, 1, v_y2_591_);
v___x_594_ = lean_box(0);
v___x_595_ = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(v___x_595_, 0, v___x_593_);
lean_ctor_set(v___x_595_, 1, v___x_594_);
v___x_596_ = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(v___x_596_, 0, v___x_592_);
lean_ctor_set(v___x_596_, 1, v___x_595_);
v___x_597_ = lp_puzzle_Puzzle_check(v_locked_585_, v_b_586_, v___x_596_);
if (lean_obj_tag(v___x_597_) == 0)
{
lean_object* v_a_598_; lean_object* v___x_600_; uint8_t v_isShared_601_; uint8_t v_isSharedCheck_605_; 
lean_dec(v_y2_591_);
lean_dec(v_x2_590_);
lean_dec(v_y1_589_);
lean_dec(v_x1_588_);
lean_dec(v_b_586_);
v_a_598_ = lean_ctor_get(v___x_597_, 0);
v_isSharedCheck_605_ = !lean_is_exclusive(v___x_597_);
if (v_isSharedCheck_605_ == 0)
{
v___x_600_ = v___x_597_;
v_isShared_601_ = v_isSharedCheck_605_;
goto v_resetjp_599_;
}
else
{
lean_inc(v_a_598_);
lean_dec(v___x_597_);
v___x_600_ = lean_box(0);
v_isShared_601_ = v_isSharedCheck_605_;
goto v_resetjp_599_;
}
v_resetjp_599_:
{
lean_object* v___x_603_; 
if (v_isShared_601_ == 0)
{
v___x_603_ = v___x_600_;
goto v_reusejp_602_;
}
else
{
lean_object* v_reuseFailAlloc_604_; 
v_reuseFailAlloc_604_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v_reuseFailAlloc_604_, 0, v_a_598_);
v___x_603_ = v_reuseFailAlloc_604_;
goto v_reusejp_602_;
}
v_reusejp_602_:
{
return v___x_603_;
}
}
}
else
{
lean_object* v___x_607_; uint8_t v_isShared_608_; uint8_t v_isSharedCheck_616_; 
v_isSharedCheck_616_ = !lean_is_exclusive(v___x_597_);
if (v_isSharedCheck_616_ == 0)
{
lean_object* v_unused_617_; 
v_unused_617_ = lean_ctor_get(v___x_597_, 0);
lean_dec(v_unused_617_);
v___x_607_ = v___x_597_;
v_isShared_608_ = v_isSharedCheck_616_;
goto v_resetjp_606_;
}
else
{
lean_dec(v___x_597_);
v___x_607_ = lean_box(0);
v_isShared_608_ = v_isSharedCheck_616_;
goto v_resetjp_606_;
}
v_resetjp_606_:
{
lean_object* v___x_609_; lean_object* v___x_610_; lean_object* v___x_611_; lean_object* v___x_612_; lean_object* v___x_614_; 
lean_inc(v_y1_589_);
lean_inc(v_x1_588_);
v___x_609_ = lp_puzzle_Puzzle_getCell(v_b_586_, v_x1_588_, v_y1_589_);
lean_inc(v_y2_591_);
lean_inc(v_x2_590_);
v___x_610_ = lp_puzzle_Puzzle_getCell(v_b_586_, v_x2_590_, v_y2_591_);
v___x_611_ = lp_puzzle_Puzzle_setCell(v_b_586_, v_x1_588_, v_y1_589_, v___x_610_);
v___x_612_ = lp_puzzle_Puzzle_setCell(v___x_611_, v_x2_590_, v_y2_591_, v___x_609_);
if (v_isShared_608_ == 0)
{
lean_ctor_set(v___x_607_, 0, v___x_612_);
v___x_614_ = v___x_607_;
goto v_reusejp_613_;
}
else
{
lean_object* v_reuseFailAlloc_615_; 
v_reuseFailAlloc_615_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v_reuseFailAlloc_615_, 0, v___x_612_);
v___x_614_ = v_reuseFailAlloc_615_;
goto v_reusejp_613_;
}
v_reusejp_613_:
{
return v___x_614_;
}
}
}
}
case 1:
{
lean_object* v_x_618_; lean_object* v_y_619_; uint8_t v_c_620_; lean_object* v___x_621_; lean_object* v___x_622_; lean_object* v___x_623_; lean_object* v___x_624_; 
v_x_618_ = lean_ctor_get(v_x_587_, 0);
lean_inc_n(v_x_618_, 2);
v_y_619_ = lean_ctor_get(v_x_587_, 1);
lean_inc_n(v_y_619_, 2);
v_c_620_ = lean_ctor_get_uint8(v_x_587_, sizeof(void*)*2);
lean_dec_ref_known(v_x_587_, 2);
v___x_621_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v___x_621_, 0, v_x_618_);
lean_ctor_set(v___x_621_, 1, v_y_619_);
v___x_622_ = lean_box(0);
v___x_623_ = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(v___x_623_, 0, v___x_621_);
lean_ctor_set(v___x_623_, 1, v___x_622_);
v___x_624_ = lp_puzzle_Puzzle_check(v_locked_585_, v_b_586_, v___x_623_);
if (lean_obj_tag(v___x_624_) == 0)
{
lean_object* v_a_625_; lean_object* v___x_627_; uint8_t v_isShared_628_; uint8_t v_isSharedCheck_632_; 
lean_dec(v_y_619_);
lean_dec(v_x_618_);
lean_dec(v_b_586_);
v_a_625_ = lean_ctor_get(v___x_624_, 0);
v_isSharedCheck_632_ = !lean_is_exclusive(v___x_624_);
if (v_isSharedCheck_632_ == 0)
{
v___x_627_ = v___x_624_;
v_isShared_628_ = v_isSharedCheck_632_;
goto v_resetjp_626_;
}
else
{
lean_inc(v_a_625_);
lean_dec(v___x_624_);
v___x_627_ = lean_box(0);
v_isShared_628_ = v_isSharedCheck_632_;
goto v_resetjp_626_;
}
v_resetjp_626_:
{
lean_object* v___x_630_; 
if (v_isShared_628_ == 0)
{
v___x_630_ = v___x_627_;
goto v_reusejp_629_;
}
else
{
lean_object* v_reuseFailAlloc_631_; 
v_reuseFailAlloc_631_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v_reuseFailAlloc_631_, 0, v_a_625_);
v___x_630_ = v_reuseFailAlloc_631_;
goto v_reusejp_629_;
}
v_reusejp_629_:
{
return v___x_630_;
}
}
}
else
{
lean_object* v___x_634_; uint8_t v_isShared_635_; uint8_t v_isSharedCheck_649_; 
v_isSharedCheck_649_ = !lean_is_exclusive(v___x_624_);
if (v_isSharedCheck_649_ == 0)
{
lean_object* v_unused_650_; 
v_unused_650_ = lean_ctor_get(v___x_624_, 0);
lean_dec(v_unused_650_);
v___x_634_ = v___x_624_;
v_isShared_635_ = v_isSharedCheck_649_;
goto v_resetjp_633_;
}
else
{
lean_dec(v___x_624_);
v___x_634_ = lean_box(0);
v_isShared_635_ = v_isSharedCheck_649_;
goto v_resetjp_633_;
}
v_resetjp_633_:
{
lean_object* v___x_636_; lean_object* v_rot_637_; lean_object* v___x_639_; uint8_t v_isShared_640_; uint8_t v_isSharedCheck_648_; 
lean_inc(v_y_619_);
lean_inc(v_x_618_);
v___x_636_ = lp_puzzle_Puzzle_getCell(v_b_586_, v_x_618_, v_y_619_);
v_rot_637_ = lean_ctor_get(v___x_636_, 0);
v_isSharedCheck_648_ = !lean_is_exclusive(v___x_636_);
if (v_isSharedCheck_648_ == 0)
{
v___x_639_ = v___x_636_;
v_isShared_640_ = v_isSharedCheck_648_;
goto v_resetjp_638_;
}
else
{
lean_inc(v_rot_637_);
lean_dec(v___x_636_);
v___x_639_ = lean_box(0);
v_isShared_640_ = v_isSharedCheck_648_;
goto v_resetjp_638_;
}
v_resetjp_638_:
{
lean_object* v___x_642_; 
if (v_isShared_640_ == 0)
{
v___x_642_ = v___x_639_;
goto v_reusejp_641_;
}
else
{
lean_object* v_reuseFailAlloc_647_; 
v_reuseFailAlloc_647_ = lean_alloc_ctor(0, 1, 1);
lean_ctor_set(v_reuseFailAlloc_647_, 0, v_rot_637_);
v___x_642_ = v_reuseFailAlloc_647_;
goto v_reusejp_641_;
}
v_reusejp_641_:
{
lean_object* v___x_643_; lean_object* v___x_645_; 
lean_ctor_set_uint8(v___x_642_, sizeof(void*)*1, v_c_620_);
v___x_643_ = lp_puzzle_Puzzle_setCell(v_b_586_, v_x_618_, v_y_619_, v___x_642_);
if (v_isShared_635_ == 0)
{
lean_ctor_set(v___x_634_, 0, v___x_643_);
v___x_645_ = v___x_634_;
goto v_reusejp_644_;
}
else
{
lean_object* v_reuseFailAlloc_646_; 
v_reuseFailAlloc_646_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v_reuseFailAlloc_646_, 0, v___x_643_);
v___x_645_ = v_reuseFailAlloc_646_;
goto v_reusejp_644_;
}
v_reusejp_644_:
{
return v___x_645_;
}
}
}
}
}
}
default: 
{
lean_object* v_x_651_; lean_object* v_y_652_; lean_object* v___x_654_; uint8_t v_isShared_655_; uint8_t v_isSharedCheck_715_; 
v_x_651_ = lean_ctor_get(v_x_587_, 0);
v_y_652_ = lean_ctor_get(v_x_587_, 1);
v_isSharedCheck_715_ = !lean_is_exclusive(v_x_587_);
if (v_isSharedCheck_715_ == 0)
{
v___x_654_ = v_x_587_;
v_isShared_655_ = v_isSharedCheck_715_;
goto v_resetjp_653_;
}
else
{
lean_inc(v_y_652_);
lean_inc(v_x_651_);
lean_dec(v_x_587_);
v___x_654_ = lean_box(0);
v_isShared_655_ = v_isSharedCheck_715_;
goto v_resetjp_653_;
}
v_resetjp_653_:
{
lean_object* v___x_657_; 
lean_inc(v_y_652_);
lean_inc(v_x_651_);
if (v_isShared_655_ == 0)
{
lean_ctor_set_tag(v___x_654_, 0);
v___x_657_ = v___x_654_;
goto v_reusejp_656_;
}
else
{
lean_object* v_reuseFailAlloc_714_; 
v_reuseFailAlloc_714_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v_reuseFailAlloc_714_, 0, v_x_651_);
lean_ctor_set(v_reuseFailAlloc_714_, 1, v_y_652_);
v___x_657_ = v_reuseFailAlloc_714_;
goto v_reusejp_656_;
}
v_reusejp_656_:
{
lean_object* v___x_658_; lean_object* v___x_659_; lean_object* v___x_660_; 
v___x_658_ = lean_box(0);
v___x_659_ = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(v___x_659_, 0, v___x_657_);
lean_ctor_set(v___x_659_, 1, v___x_658_);
lean_inc_ref(v___x_659_);
v___x_660_ = lp_puzzle_Puzzle_check(v_locked_585_, v_b_586_, v___x_659_);
if (lean_obj_tag(v___x_660_) == 0)
{
lean_object* v_a_661_; lean_object* v___x_663_; uint8_t v_isShared_664_; uint8_t v_isSharedCheck_668_; 
lean_dec_ref_known(v___x_659_, 2);
lean_dec(v_y_652_);
lean_dec(v_x_651_);
lean_dec(v_b_586_);
v_a_661_ = lean_ctor_get(v___x_660_, 0);
v_isSharedCheck_668_ = !lean_is_exclusive(v___x_660_);
if (v_isSharedCheck_668_ == 0)
{
v___x_663_ = v___x_660_;
v_isShared_664_ = v_isSharedCheck_668_;
goto v_resetjp_662_;
}
else
{
lean_inc(v_a_661_);
lean_dec(v___x_660_);
v___x_663_ = lean_box(0);
v_isShared_664_ = v_isSharedCheck_668_;
goto v_resetjp_662_;
}
v_resetjp_662_:
{
lean_object* v___x_666_; 
if (v_isShared_664_ == 0)
{
v___x_666_ = v___x_663_;
goto v_reusejp_665_;
}
else
{
lean_object* v_reuseFailAlloc_667_; 
v_reuseFailAlloc_667_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v_reuseFailAlloc_667_, 0, v_a_661_);
v___x_666_ = v_reuseFailAlloc_667_;
goto v_reusejp_665_;
}
v_reusejp_665_:
{
return v___x_666_;
}
}
}
else
{
lean_object* v___x_670_; uint8_t v_isShared_671_; uint8_t v_isSharedCheck_712_; 
v_isSharedCheck_712_ = !lean_is_exclusive(v___x_660_);
if (v_isSharedCheck_712_ == 0)
{
lean_object* v_unused_713_; 
v_unused_713_ = lean_ctor_get(v___x_660_, 0);
lean_dec(v_unused_713_);
v___x_670_ = v___x_660_;
v_isShared_671_ = v_isSharedCheck_712_;
goto v_resetjp_669_;
}
else
{
lean_dec(v___x_660_);
v___x_670_ = lean_box(0);
v_isShared_671_ = v_isSharedCheck_712_;
goto v_resetjp_669_;
}
v_resetjp_669_:
{
lean_object* v___x_672_; lean_object* v_rot_673_; 
lean_inc(v_y_652_);
lean_inc(v_x_651_);
v___x_672_ = lp_puzzle_Puzzle_getCell(v_b_586_, v_x_651_, v_y_652_);
v_rot_673_ = lean_ctor_get(v___x_672_, 0);
lean_inc(v_rot_673_);
if (lean_obj_tag(v_rot_673_) == 0)
{
lean_object* v___x_674_; lean_object* v___x_675_; lean_object* v___x_676_; lean_object* v___x_677_; lean_object* v___x_678_; lean_object* v___x_679_; lean_object* v___x_680_; lean_object* v___x_681_; lean_object* v___x_682_; lean_object* v___x_683_; lean_object* v___x_685_; 
lean_dec_ref(v___x_672_);
lean_dec(v_b_586_);
v___x_674_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__1));
v___x_675_ = l_Nat_reprFast(v_x_651_);
v___x_676_ = lean_string_append(v___x_674_, v___x_675_);
lean_dec_ref(v___x_675_);
v___x_677_ = ((lean_object*)(lp_puzzle_Puzzle_check___closed__2));
v___x_678_ = lean_string_append(v___x_676_, v___x_677_);
v___x_679_ = l_Nat_reprFast(v_y_652_);
v___x_680_ = lean_string_append(v___x_678_, v___x_679_);
lean_dec_ref(v___x_679_);
v___x_681_ = ((lean_object*)(lp_puzzle_Puzzle_apply___closed__0));
v___x_682_ = lean_string_append(v___x_680_, v___x_681_);
v___x_683_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v___x_683_, 0, v___x_659_);
lean_ctor_set(v___x_683_, 1, v___x_682_);
if (v_isShared_671_ == 0)
{
lean_ctor_set_tag(v___x_670_, 0);
lean_ctor_set(v___x_670_, 0, v___x_683_);
v___x_685_ = v___x_670_;
goto v_reusejp_684_;
}
else
{
lean_object* v_reuseFailAlloc_686_; 
v_reuseFailAlloc_686_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v_reuseFailAlloc_686_, 0, v___x_683_);
v___x_685_ = v_reuseFailAlloc_686_;
goto v_reusejp_684_;
}
v_reusejp_684_:
{
return v___x_685_;
}
}
else
{
uint8_t v_color_687_; lean_object* v___x_689_; uint8_t v_isShared_690_; uint8_t v_isSharedCheck_710_; 
lean_dec_ref_known(v___x_659_, 2);
v_color_687_ = lean_ctor_get_uint8(v___x_672_, sizeof(void*)*1);
v_isSharedCheck_710_ = !lean_is_exclusive(v___x_672_);
if (v_isSharedCheck_710_ == 0)
{
lean_object* v_unused_711_; 
v_unused_711_ = lean_ctor_get(v___x_672_, 0);
lean_dec(v_unused_711_);
v___x_689_ = v___x_672_;
v_isShared_690_ = v_isSharedCheck_710_;
goto v_resetjp_688_;
}
else
{
lean_dec(v___x_672_);
v___x_689_ = lean_box(0);
v_isShared_690_ = v_isSharedCheck_710_;
goto v_resetjp_688_;
}
v_resetjp_688_:
{
lean_object* v_val_691_; lean_object* v___x_693_; uint8_t v_isShared_694_; uint8_t v_isSharedCheck_709_; 
v_val_691_ = lean_ctor_get(v_rot_673_, 0);
v_isSharedCheck_709_ = !lean_is_exclusive(v_rot_673_);
if (v_isSharedCheck_709_ == 0)
{
v___x_693_ = v_rot_673_;
v_isShared_694_ = v_isSharedCheck_709_;
goto v_resetjp_692_;
}
else
{
lean_inc(v_val_691_);
lean_dec(v_rot_673_);
v___x_693_ = lean_box(0);
v_isShared_694_ = v_isSharedCheck_709_;
goto v_resetjp_692_;
}
v_resetjp_692_:
{
lean_object* v___x_695_; lean_object* v___x_696_; lean_object* v___x_697_; lean_object* v___x_698_; lean_object* v___x_700_; 
v___x_695_ = lean_unsigned_to_nat(1u);
v___x_696_ = lean_nat_add(v_val_691_, v___x_695_);
lean_dec(v_val_691_);
v___x_697_ = lean_unsigned_to_nat(4u);
v___x_698_ = lean_nat_mod(v___x_696_, v___x_697_);
lean_dec(v___x_696_);
if (v_isShared_694_ == 0)
{
lean_ctor_set(v___x_693_, 0, v___x_698_);
v___x_700_ = v___x_693_;
goto v_reusejp_699_;
}
else
{
lean_object* v_reuseFailAlloc_708_; 
v_reuseFailAlloc_708_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v_reuseFailAlloc_708_, 0, v___x_698_);
v___x_700_ = v_reuseFailAlloc_708_;
goto v_reusejp_699_;
}
v_reusejp_699_:
{
lean_object* v___x_702_; 
if (v_isShared_690_ == 0)
{
lean_ctor_set(v___x_689_, 0, v___x_700_);
v___x_702_ = v___x_689_;
goto v_reusejp_701_;
}
else
{
lean_object* v_reuseFailAlloc_707_; 
v_reuseFailAlloc_707_ = lean_alloc_ctor(0, 1, 1);
lean_ctor_set(v_reuseFailAlloc_707_, 0, v___x_700_);
lean_ctor_set_uint8(v_reuseFailAlloc_707_, sizeof(void*)*1, v_color_687_);
v___x_702_ = v_reuseFailAlloc_707_;
goto v_reusejp_701_;
}
v_reusejp_701_:
{
lean_object* v___x_703_; lean_object* v___x_705_; 
v___x_703_ = lp_puzzle_Puzzle_setCell(v_b_586_, v_x_651_, v_y_652_, v___x_702_);
if (v_isShared_671_ == 0)
{
lean_ctor_set(v___x_670_, 0, v___x_703_);
v___x_705_ = v___x_670_;
goto v_reusejp_704_;
}
else
{
lean_object* v_reuseFailAlloc_706_; 
v_reuseFailAlloc_706_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v_reuseFailAlloc_706_, 0, v___x_703_);
v___x_705_ = v_reuseFailAlloc_706_;
goto v_reusejp_704_;
}
v_reusejp_704_:
{
return v___x_705_;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_apply___boxed(lean_object* v_locked_716_, lean_object* v_b_717_, lean_object* v_x_718_){
_start:
{
lean_object* v_res_719_; 
v_res_719_ = lp_puzzle_Puzzle_apply(v_locked_716_, v_b_717_, v_x_718_);
lean_dec(v_locked_716_);
return v_res_719_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_run(lean_object* v_locked_720_, lean_object* v_x_721_, lean_object* v_x_722_){
_start:
{
if (lean_obj_tag(v_x_722_) == 0)
{
lean_object* v___x_723_; 
v___x_723_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v___x_723_, 0, v_x_721_);
return v___x_723_;
}
else
{
lean_object* v_head_724_; lean_object* v_tail_725_; lean_object* v___x_726_; 
v_head_724_ = lean_ctor_get(v_x_722_, 0);
lean_inc(v_head_724_);
v_tail_725_ = lean_ctor_get(v_x_722_, 1);
lean_inc(v_tail_725_);
lean_dec_ref_known(v_x_722_, 2);
v___x_726_ = lp_puzzle_Puzzle_apply(v_locked_720_, v_x_721_, v_head_724_);
if (lean_obj_tag(v___x_726_) == 0)
{
lean_object* v___x_727_; 
lean_dec_ref_known(v___x_726_, 1);
lean_dec(v_tail_725_);
v___x_727_ = lean_box(0);
return v___x_727_;
}
else
{
lean_object* v_a_728_; 
v_a_728_ = lean_ctor_get(v___x_726_, 0);
lean_inc(v_a_728_);
lean_dec_ref_known(v___x_726_, 1);
v_x_721_ = v_a_728_;
v_x_722_ = v_tail_725_;
goto _start;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_run___boxed(lean_object* v_locked_730_, lean_object* v_x_731_, lean_object* v_x_732_){
_start:
{
lean_object* v_res_733_; 
v_res_733_ = lp_puzzle_Puzzle_run(v_locked_730_, v_x_731_, v_x_732_);
lean_dec(v_locked_730_);
return v_res_733_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_renderRot(lean_object* v_x_735_){
_start:
{
if (lean_obj_tag(v_x_735_) == 0)
{
lean_object* v___x_736_; 
v___x_736_ = ((lean_object*)(lp_puzzle_Puzzle_renderRot___closed__0));
return v___x_736_;
}
else
{
lean_object* v_val_737_; lean_object* v___x_738_; 
v_val_737_ = lean_ctor_get(v_x_735_, 0);
lean_inc(v_val_737_);
lean_dec_ref_known(v_x_735_, 1);
v___x_738_ = l_Nat_reprFast(v_val_737_);
return v___x_738_;
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_mapTR_loop___at___00Puzzle_render_spec__0(lean_object* v_a_740_, lean_object* v_a_741_){
_start:
{
if (lean_obj_tag(v_a_740_) == 0)
{
lean_object* v___x_742_; 
v___x_742_ = l_List_reverse___redArg(v_a_741_);
return v___x_742_;
}
else
{
lean_object* v_head_743_; lean_object* v_tail_744_; lean_object* v___x_746_; uint8_t v_isShared_747_; uint8_t v_isSharedCheck_759_; 
v_head_743_ = lean_ctor_get(v_a_740_, 0);
v_tail_744_ = lean_ctor_get(v_a_740_, 1);
v_isSharedCheck_759_ = !lean_is_exclusive(v_a_740_);
if (v_isSharedCheck_759_ == 0)
{
v___x_746_ = v_a_740_;
v_isShared_747_ = v_isSharedCheck_759_;
goto v_resetjp_745_;
}
else
{
lean_inc(v_tail_744_);
lean_inc(v_head_743_);
lean_dec(v_a_740_);
v___x_746_ = lean_box(0);
v_isShared_747_ = v_isSharedCheck_759_;
goto v_resetjp_745_;
}
v_resetjp_745_:
{
uint8_t v_color_748_; lean_object* v_rot_749_; lean_object* v___x_750_; lean_object* v___x_751_; lean_object* v___x_752_; lean_object* v___x_753_; lean_object* v___x_754_; lean_object* v___x_756_; 
v_color_748_ = lean_ctor_get_uint8(v_head_743_, sizeof(void*)*1);
v_rot_749_ = lean_ctor_get(v_head_743_, 0);
lean_inc(v_rot_749_);
lean_dec(v_head_743_);
v___x_750_ = lp_puzzle_Puzzle_Color_name(v_color_748_);
v___x_751_ = ((lean_object*)(lp_puzzle_List_mapTR_loop___at___00Puzzle_render_spec__0___closed__0));
v___x_752_ = lean_string_append(v___x_750_, v___x_751_);
v___x_753_ = lp_puzzle_Puzzle_renderRot(v_rot_749_);
v___x_754_ = lean_string_append(v___x_752_, v___x_753_);
lean_dec_ref(v___x_753_);
if (v_isShared_747_ == 0)
{
lean_ctor_set(v___x_746_, 1, v_a_741_);
lean_ctor_set(v___x_746_, 0, v___x_754_);
v___x_756_ = v___x_746_;
goto v_reusejp_755_;
}
else
{
lean_object* v_reuseFailAlloc_758_; 
v_reuseFailAlloc_758_ = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(v_reuseFailAlloc_758_, 0, v___x_754_);
lean_ctor_set(v_reuseFailAlloc_758_, 1, v_a_741_);
v___x_756_ = v_reuseFailAlloc_758_;
goto v_reusejp_755_;
}
v_reusejp_755_:
{
v_a_740_ = v_tail_744_;
v_a_741_ = v___x_756_;
goto _start;
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_mapTR_loop___at___00Puzzle_render_spec__1(lean_object* v_a_760_, lean_object* v_a_761_){
_start:
{
if (lean_obj_tag(v_a_760_) == 0)
{
lean_object* v___x_762_; 
v___x_762_ = l_List_reverse___redArg(v_a_761_);
return v___x_762_;
}
else
{
lean_object* v_head_763_; lean_object* v_tail_764_; lean_object* v___x_766_; uint8_t v_isShared_767_; uint8_t v_isSharedCheck_776_; 
v_head_763_ = lean_ctor_get(v_a_760_, 0);
v_tail_764_ = lean_ctor_get(v_a_760_, 1);
v_isSharedCheck_776_ = !lean_is_exclusive(v_a_760_);
if (v_isSharedCheck_776_ == 0)
{
v___x_766_ = v_a_760_;
v_isShared_767_ = v_isSharedCheck_776_;
goto v_resetjp_765_;
}
else
{
lean_inc(v_tail_764_);
lean_inc(v_head_763_);
lean_dec(v_a_760_);
v___x_766_ = lean_box(0);
v_isShared_767_ = v_isSharedCheck_776_;
goto v_resetjp_765_;
}
v_resetjp_765_:
{
lean_object* v___x_768_; lean_object* v___x_769_; lean_object* v___x_770_; lean_object* v___x_771_; lean_object* v___x_773_; 
v___x_768_ = ((lean_object*)(lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__8));
v___x_769_ = lean_box(0);
v___x_770_ = lp_puzzle_List_mapTR_loop___at___00Puzzle_render_spec__0(v_head_763_, v___x_769_);
v___x_771_ = l_String_intercalate(v___x_768_, v___x_770_);
if (v_isShared_767_ == 0)
{
lean_ctor_set(v___x_766_, 1, v_a_761_);
lean_ctor_set(v___x_766_, 0, v___x_771_);
v___x_773_ = v___x_766_;
goto v_reusejp_772_;
}
else
{
lean_object* v_reuseFailAlloc_775_; 
v_reuseFailAlloc_775_ = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(v_reuseFailAlloc_775_, 0, v___x_771_);
lean_ctor_set(v_reuseFailAlloc_775_, 1, v_a_761_);
v___x_773_ = v_reuseFailAlloc_775_;
goto v_reusejp_772_;
}
v_reusejp_772_:
{
v_a_760_ = v_tail_764_;
v_a_761_ = v___x_773_;
goto _start;
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_render(lean_object* v_b_778_){
_start:
{
lean_object* v___x_779_; lean_object* v___x_780_; lean_object* v___x_781_; lean_object* v___x_782_; 
v___x_779_ = ((lean_object*)(lp_puzzle_Puzzle_render___closed__0));
v___x_780_ = lean_box(0);
v___x_781_ = lp_puzzle_List_mapTR_loop___at___00Puzzle_render_spec__1(v_b_778_, v___x_780_);
v___x_782_ = l_String_intercalate(v___x_779_, v___x_781_);
return v___x_782_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_IO_print___at___00IO_println___at___00Puzzle_runAll_spec__1_spec__1(lean_object* v_s_783_){
_start:
{
lean_object* v___x_785_; lean_object* v_putStr_786_; lean_object* v___x_787_; 
v___x_785_ = lean_get_stdout();
v_putStr_786_ = lean_ctor_get(v___x_785_, 4);
lean_inc_ref(v_putStr_786_);
lean_dec_ref(v___x_785_);
v___x_787_ = lean_apply_2(v_putStr_786_, v_s_783_, lean_box(0));
return v___x_787_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_IO_print___at___00IO_println___at___00Puzzle_runAll_spec__1_spec__1___boxed(lean_object* v_s_788_, lean_object* v_a_789_){
_start:
{
lean_object* v_res_790_; 
v_res_790_ = lp_puzzle_IO_print___at___00IO_println___at___00Puzzle_runAll_spec__1_spec__1(v_s_788_);
return v_res_790_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_IO_println___at___00Puzzle_runAll_spec__1(lean_object* v_s_791_){
_start:
{
uint32_t v___x_793_; lean_object* v___x_794_; lean_object* v___x_795_; 
v___x_793_ = 10;
v___x_794_ = lean_string_push(v_s_791_, v___x_793_);
v___x_795_ = lp_puzzle_IO_print___at___00IO_println___at___00Puzzle_runAll_spec__1_spec__1(v___x_794_);
return v___x_795_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_IO_println___at___00Puzzle_runAll_spec__1___boxed(lean_object* v_s_796_, lean_object* v_a_797_){
_start:
{
lean_object* v_res_798_; 
v_res_798_ = lp_puzzle_IO_println___at___00Puzzle_runAll_spec__1(v_s_796_);
return v_res_798_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_mapTR_loop___at___00Puzzle_runAll_spec__0(lean_object* v_a_799_, lean_object* v_a_800_){
_start:
{
if (lean_obj_tag(v_a_799_) == 0)
{
lean_object* v___x_801_; 
v___x_801_ = l_List_reverse___redArg(v_a_800_);
return v___x_801_;
}
else
{
lean_object* v_head_802_; lean_object* v_tail_803_; lean_object* v___x_805_; uint8_t v_isShared_806_; uint8_t v_isSharedCheck_818_; 
v_head_802_ = lean_ctor_get(v_a_799_, 0);
v_tail_803_ = lean_ctor_get(v_a_799_, 1);
v_isSharedCheck_818_ = !lean_is_exclusive(v_a_799_);
if (v_isSharedCheck_818_ == 0)
{
v___x_805_ = v_a_799_;
v_isShared_806_ = v_isSharedCheck_818_;
goto v_resetjp_804_;
}
else
{
lean_inc(v_tail_803_);
lean_inc(v_head_802_);
lean_dec(v_a_799_);
v___x_805_ = lean_box(0);
v_isShared_806_ = v_isSharedCheck_818_;
goto v_resetjp_804_;
}
v_resetjp_804_:
{
lean_object* v_fst_807_; lean_object* v_snd_808_; lean_object* v___x_809_; lean_object* v___x_810_; lean_object* v___x_811_; lean_object* v___x_812_; lean_object* v___x_813_; lean_object* v___x_815_; 
v_fst_807_ = lean_ctor_get(v_head_802_, 0);
lean_inc(v_fst_807_);
v_snd_808_ = lean_ctor_get(v_head_802_, 1);
lean_inc(v_snd_808_);
lean_dec(v_head_802_);
v___x_809_ = l_Nat_reprFast(v_fst_807_);
v___x_810_ = ((lean_object*)(lp_puzzle_Puzzle_instReprCell_repr___redArg___closed__8));
v___x_811_ = lean_string_append(v___x_809_, v___x_810_);
v___x_812_ = l_Nat_reprFast(v_snd_808_);
v___x_813_ = lean_string_append(v___x_811_, v___x_812_);
lean_dec_ref(v___x_812_);
if (v_isShared_806_ == 0)
{
lean_ctor_set(v___x_805_, 1, v_a_800_);
lean_ctor_set(v___x_805_, 0, v___x_813_);
v___x_815_ = v___x_805_;
goto v_reusejp_814_;
}
else
{
lean_object* v_reuseFailAlloc_817_; 
v_reuseFailAlloc_817_ = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(v_reuseFailAlloc_817_, 0, v___x_813_);
lean_ctor_set(v_reuseFailAlloc_817_, 1, v_a_800_);
v___x_815_ = v_reuseFailAlloc_817_;
goto v_reusejp_814_;
}
v_reusejp_814_:
{
v_a_799_ = v_tail_803_;
v_a_800_ = v___x_815_;
goto _start;
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg(lean_object* v_locked_825_, lean_object* v_as_x27_826_, lean_object* v_b_827_){
_start:
{
if (lean_obj_tag(v_as_x27_826_) == 0)
{
lean_object* v___x_829_; 
v___x_829_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v___x_829_, 0, v_b_827_);
return v___x_829_;
}
else
{
lean_object* v_head_830_; lean_object* v_tail_831_; lean_object* v_fst_832_; lean_object* v_snd_833_; lean_object* v_snd_834_; lean_object* v___x_836_; uint8_t v_isShared_837_; uint8_t v_isSharedCheck_897_; 
v_head_830_ = lean_ctor_get(v_as_x27_826_, 0);
v_tail_831_ = lean_ctor_get(v_as_x27_826_, 1);
v_fst_832_ = lean_ctor_get(v_head_830_, 0);
v_snd_833_ = lean_ctor_get(v_head_830_, 1);
v_snd_834_ = lean_ctor_get(v_b_827_, 1);
v_isSharedCheck_897_ = !lean_is_exclusive(v_b_827_);
if (v_isSharedCheck_897_ == 0)
{
lean_object* v_unused_898_; 
v_unused_898_ = lean_ctor_get(v_b_827_, 0);
lean_dec(v_unused_898_);
v___x_836_ = v_b_827_;
v_isShared_837_ = v_isSharedCheck_897_;
goto v_resetjp_835_;
}
else
{
lean_inc(v_snd_834_);
lean_dec(v_b_827_);
v___x_836_ = lean_box(0);
v_isShared_837_ = v_isSharedCheck_897_;
goto v_resetjp_835_;
}
v_resetjp_835_:
{
lean_object* v___x_838_; 
lean_inc(v_snd_833_);
lean_inc(v_snd_834_);
v___x_838_ = lp_puzzle_Puzzle_apply(v_locked_825_, v_snd_834_, v_snd_833_);
if (lean_obj_tag(v___x_838_) == 0)
{
lean_object* v_a_839_; lean_object* v_cells_840_; lean_object* v_message_841_; lean_object* v___x_842_; lean_object* v___x_843_; lean_object* v___x_844_; lean_object* v___x_845_; lean_object* v___x_846_; lean_object* v___x_847_; lean_object* v___x_848_; lean_object* v___x_849_; lean_object* v___x_850_; lean_object* v___x_851_; lean_object* v___x_852_; lean_object* v___x_853_; lean_object* v___x_854_; 
v_a_839_ = lean_ctor_get(v___x_838_, 0);
lean_inc(v_a_839_);
lean_dec_ref_known(v___x_838_, 1);
v_cells_840_ = lean_ctor_get(v_a_839_, 0);
lean_inc(v_cells_840_);
v_message_841_ = lean_ctor_get(v_a_839_, 1);
lean_inc_ref(v_message_841_);
lean_dec(v_a_839_);
v___x_842_ = ((lean_object*)(lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__0));
v___x_843_ = lean_box(0);
v___x_844_ = lp_puzzle_List_mapTR_loop___at___00Puzzle_runAll_spec__0(v_cells_840_, v___x_843_);
v___x_845_ = l_String_intercalate(v___x_842_, v___x_844_);
v___x_846_ = ((lean_object*)(lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__1));
lean_inc(v_fst_832_);
v___x_847_ = l_Nat_reprFast(v_fst_832_);
v___x_848_ = lean_string_append(v___x_846_, v___x_847_);
lean_dec_ref(v___x_847_);
v___x_849_ = ((lean_object*)(lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__2));
v___x_850_ = lean_string_append(v___x_848_, v___x_849_);
v___x_851_ = lean_string_append(v___x_850_, v___x_845_);
lean_dec_ref(v___x_845_);
v___x_852_ = lean_string_append(v___x_851_, v___x_849_);
v___x_853_ = lean_string_append(v___x_852_, v_message_841_);
lean_dec_ref(v_message_841_);
v___x_854_ = lp_puzzle_IO_println___at___00Puzzle_runAll_spec__1(v___x_853_);
if (lean_obj_tag(v___x_854_) == 0)
{
lean_object* v___x_856_; uint8_t v_isShared_857_; uint8_t v_isSharedCheck_865_; 
v_isSharedCheck_865_ = !lean_is_exclusive(v___x_854_);
if (v_isSharedCheck_865_ == 0)
{
lean_object* v_unused_866_; 
v_unused_866_ = lean_ctor_get(v___x_854_, 0);
lean_dec(v_unused_866_);
v___x_856_ = v___x_854_;
v_isShared_857_ = v_isSharedCheck_865_;
goto v_resetjp_855_;
}
else
{
lean_dec(v___x_854_);
v___x_856_ = lean_box(0);
v_isShared_857_ = v_isSharedCheck_865_;
goto v_resetjp_855_;
}
v_resetjp_855_:
{
lean_object* v___x_858_; lean_object* v___x_860_; 
v___x_858_ = ((lean_object*)(lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__3));
if (v_isShared_837_ == 0)
{
lean_ctor_set(v___x_836_, 0, v___x_858_);
v___x_860_ = v___x_836_;
goto v_reusejp_859_;
}
else
{
lean_object* v_reuseFailAlloc_864_; 
v_reuseFailAlloc_864_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v_reuseFailAlloc_864_, 0, v___x_858_);
lean_ctor_set(v_reuseFailAlloc_864_, 1, v_snd_834_);
v___x_860_ = v_reuseFailAlloc_864_;
goto v_reusejp_859_;
}
v_reusejp_859_:
{
lean_object* v___x_862_; 
if (v_isShared_857_ == 0)
{
lean_ctor_set(v___x_856_, 0, v___x_860_);
v___x_862_ = v___x_856_;
goto v_reusejp_861_;
}
else
{
lean_object* v_reuseFailAlloc_863_; 
v_reuseFailAlloc_863_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v_reuseFailAlloc_863_, 0, v___x_860_);
v___x_862_ = v_reuseFailAlloc_863_;
goto v_reusejp_861_;
}
v_reusejp_861_:
{
return v___x_862_;
}
}
}
}
else
{
lean_object* v_a_867_; lean_object* v___x_869_; uint8_t v_isShared_870_; uint8_t v_isSharedCheck_874_; 
lean_del_object(v___x_836_);
lean_dec(v_snd_834_);
v_a_867_ = lean_ctor_get(v___x_854_, 0);
v_isSharedCheck_874_ = !lean_is_exclusive(v___x_854_);
if (v_isSharedCheck_874_ == 0)
{
v___x_869_ = v___x_854_;
v_isShared_870_ = v_isSharedCheck_874_;
goto v_resetjp_868_;
}
else
{
lean_inc(v_a_867_);
lean_dec(v___x_854_);
v___x_869_ = lean_box(0);
v_isShared_870_ = v_isSharedCheck_874_;
goto v_resetjp_868_;
}
v_resetjp_868_:
{
lean_object* v___x_872_; 
if (v_isShared_870_ == 0)
{
v___x_872_ = v___x_869_;
goto v_reusejp_871_;
}
else
{
lean_object* v_reuseFailAlloc_873_; 
v_reuseFailAlloc_873_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v_reuseFailAlloc_873_, 0, v_a_867_);
v___x_872_ = v_reuseFailAlloc_873_;
goto v_reusejp_871_;
}
v_reusejp_871_:
{
return v___x_872_;
}
}
}
}
else
{
lean_object* v_a_875_; lean_object* v___x_876_; lean_object* v___x_877_; lean_object* v___x_878_; lean_object* v___x_879_; lean_object* v___x_880_; lean_object* v___x_881_; lean_object* v___x_882_; lean_object* v___x_883_; lean_object* v___x_884_; 
lean_dec(v_snd_834_);
v_a_875_ = lean_ctor_get(v___x_838_, 0);
lean_inc_n(v_a_875_, 2);
lean_dec_ref_known(v___x_838_, 1);
v___x_876_ = lean_box(0);
v___x_877_ = ((lean_object*)(lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__4));
lean_inc(v_fst_832_);
v___x_878_ = l_Nat_reprFast(v_fst_832_);
v___x_879_ = lean_string_append(v___x_877_, v___x_878_);
lean_dec_ref(v___x_878_);
v___x_880_ = ((lean_object*)(lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___closed__2));
v___x_881_ = lean_string_append(v___x_879_, v___x_880_);
v___x_882_ = lp_puzzle_Puzzle_render(v_a_875_);
v___x_883_ = lean_string_append(v___x_881_, v___x_882_);
lean_dec_ref(v___x_882_);
v___x_884_ = lp_puzzle_IO_println___at___00Puzzle_runAll_spec__1(v___x_883_);
if (lean_obj_tag(v___x_884_) == 0)
{
lean_object* v___x_886_; 
lean_dec_ref_known(v___x_884_, 1);
if (v_isShared_837_ == 0)
{
lean_ctor_set(v___x_836_, 1, v_a_875_);
lean_ctor_set(v___x_836_, 0, v___x_876_);
v___x_886_ = v___x_836_;
goto v_reusejp_885_;
}
else
{
lean_object* v_reuseFailAlloc_888_; 
v_reuseFailAlloc_888_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v_reuseFailAlloc_888_, 0, v___x_876_);
lean_ctor_set(v_reuseFailAlloc_888_, 1, v_a_875_);
v___x_886_ = v_reuseFailAlloc_888_;
goto v_reusejp_885_;
}
v_reusejp_885_:
{
v_as_x27_826_ = v_tail_831_;
v_b_827_ = v___x_886_;
goto _start;
}
}
else
{
lean_object* v_a_889_; lean_object* v___x_891_; uint8_t v_isShared_892_; uint8_t v_isSharedCheck_896_; 
lean_dec(v_a_875_);
lean_del_object(v___x_836_);
v_a_889_ = lean_ctor_get(v___x_884_, 0);
v_isSharedCheck_896_ = !lean_is_exclusive(v___x_884_);
if (v_isSharedCheck_896_ == 0)
{
v___x_891_ = v___x_884_;
v_isShared_892_ = v_isSharedCheck_896_;
goto v_resetjp_890_;
}
else
{
lean_inc(v_a_889_);
lean_dec(v___x_884_);
v___x_891_ = lean_box(0);
v_isShared_892_ = v_isSharedCheck_896_;
goto v_resetjp_890_;
}
v_resetjp_890_:
{
lean_object* v___x_894_; 
if (v_isShared_892_ == 0)
{
v___x_894_ = v___x_891_;
goto v_reusejp_893_;
}
else
{
lean_object* v_reuseFailAlloc_895_; 
v_reuseFailAlloc_895_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v_reuseFailAlloc_895_, 0, v_a_889_);
v___x_894_ = v_reuseFailAlloc_895_;
goto v_reusejp_893_;
}
v_reusejp_893_:
{
return v___x_894_;
}
}
}
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg___boxed(lean_object* v_locked_899_, lean_object* v_as_x27_900_, lean_object* v_b_901_, lean_object* v___y_902_){
_start:
{
lean_object* v_res_903_; 
v_res_903_ = lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg(v_locked_899_, v_as_x27_900_, v_b_901_);
lean_dec(v_as_x27_900_);
lean_dec(v_locked_899_);
return v_res_903_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_runAll(lean_object* v_locked_904_, lean_object* v_b_905_, lean_object* v_ops_906_){
_start:
{
lean_object* v___x_908_; lean_object* v___x_909_; lean_object* v___x_910_; 
v___x_908_ = lean_box(0);
v___x_909_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v___x_909_, 0, v___x_908_);
lean_ctor_set(v___x_909_, 1, v_b_905_);
v___x_910_ = lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg(v_locked_904_, v_ops_906_, v___x_909_);
if (lean_obj_tag(v___x_910_) == 0)
{
lean_object* v_a_911_; lean_object* v___x_913_; uint8_t v_isShared_914_; uint8_t v_isSharedCheck_925_; 
v_a_911_ = lean_ctor_get(v___x_910_, 0);
v_isSharedCheck_925_ = !lean_is_exclusive(v___x_910_);
if (v_isSharedCheck_925_ == 0)
{
v___x_913_ = v___x_910_;
v_isShared_914_ = v_isSharedCheck_925_;
goto v_resetjp_912_;
}
else
{
lean_inc(v_a_911_);
lean_dec(v___x_910_);
v___x_913_ = lean_box(0);
v_isShared_914_ = v_isSharedCheck_925_;
goto v_resetjp_912_;
}
v_resetjp_912_:
{
lean_object* v_fst_915_; 
v_fst_915_ = lean_ctor_get(v_a_911_, 0);
if (lean_obj_tag(v_fst_915_) == 0)
{
lean_object* v_snd_916_; lean_object* v___x_917_; lean_object* v___x_919_; 
v_snd_916_ = lean_ctor_get(v_a_911_, 1);
lean_inc(v_snd_916_);
lean_dec(v_a_911_);
v___x_917_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v___x_917_, 0, v_snd_916_);
if (v_isShared_914_ == 0)
{
lean_ctor_set(v___x_913_, 0, v___x_917_);
v___x_919_ = v___x_913_;
goto v_reusejp_918_;
}
else
{
lean_object* v_reuseFailAlloc_920_; 
v_reuseFailAlloc_920_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v_reuseFailAlloc_920_, 0, v___x_917_);
v___x_919_ = v_reuseFailAlloc_920_;
goto v_reusejp_918_;
}
v_reusejp_918_:
{
return v___x_919_;
}
}
else
{
lean_object* v_val_921_; lean_object* v___x_923_; 
lean_inc_ref(v_fst_915_);
lean_dec(v_a_911_);
v_val_921_ = lean_ctor_get(v_fst_915_, 0);
lean_inc(v_val_921_);
lean_dec_ref_known(v_fst_915_, 1);
if (v_isShared_914_ == 0)
{
lean_ctor_set(v___x_913_, 0, v_val_921_);
v___x_923_ = v___x_913_;
goto v_reusejp_922_;
}
else
{
lean_object* v_reuseFailAlloc_924_; 
v_reuseFailAlloc_924_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v_reuseFailAlloc_924_, 0, v_val_921_);
v___x_923_ = v_reuseFailAlloc_924_;
goto v_reusejp_922_;
}
v_reusejp_922_:
{
return v___x_923_;
}
}
}
}
else
{
lean_object* v_a_926_; lean_object* v___x_928_; uint8_t v_isShared_929_; uint8_t v_isSharedCheck_933_; 
v_a_926_ = lean_ctor_get(v___x_910_, 0);
v_isSharedCheck_933_ = !lean_is_exclusive(v___x_910_);
if (v_isSharedCheck_933_ == 0)
{
v___x_928_ = v___x_910_;
v_isShared_929_ = v_isSharedCheck_933_;
goto v_resetjp_927_;
}
else
{
lean_inc(v_a_926_);
lean_dec(v___x_910_);
v___x_928_ = lean_box(0);
v_isShared_929_ = v_isSharedCheck_933_;
goto v_resetjp_927_;
}
v_resetjp_927_:
{
lean_object* v___x_931_; 
if (v_isShared_929_ == 0)
{
v___x_931_ = v___x_928_;
goto v_reusejp_930_;
}
else
{
lean_object* v_reuseFailAlloc_932_; 
v_reuseFailAlloc_932_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v_reuseFailAlloc_932_, 0, v_a_926_);
v___x_931_ = v_reuseFailAlloc_932_;
goto v_reusejp_930_;
}
v_reusejp_930_:
{
return v___x_931_;
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_runAll___boxed(lean_object* v_locked_934_, lean_object* v_b_935_, lean_object* v_ops_936_, lean_object* v_a_937_){
_start:
{
lean_object* v_res_938_; 
v_res_938_ = lp_puzzle_Puzzle_runAll(v_locked_934_, v_b_935_, v_ops_936_);
lean_dec(v_ops_936_);
lean_dec(v_locked_934_);
return v_res_938_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2(lean_object* v_locked_939_, lean_object* v_as_940_, lean_object* v_as_x27_941_, lean_object* v_b_942_, lean_object* v_a_943_){
_start:
{
lean_object* v___x_945_; 
v___x_945_ = lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___redArg(v_locked_939_, v_as_x27_941_, v_b_942_);
return v___x_945_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2___boxed(lean_object* v_locked_946_, lean_object* v_as_947_, lean_object* v_as_x27_948_, lean_object* v_b_949_, lean_object* v_a_950_, lean_object* v___y_951_){
_start:
{
lean_object* v_res_952_; 
v_res_952_ = lp_puzzle_List_forIn_x27_loop___at___00Puzzle_runAll_spec__2(v_locked_946_, v_as_947_, v_as_x27_948_, v_b_949_, v_a_950_);
lean_dec(v_as_x27_948_);
lean_dec(v_as_947_);
lean_dec(v_locked_946_);
return v_res_952_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_runChecked(lean_object* v_locked_956_, lean_object* v_b_957_, lean_object* v_ops_958_, lean_object* v_valid_959_){
_start:
{
lean_object* v___x_961_; 
v___x_961_ = lp_puzzle_Puzzle_runAll(v_locked_956_, v_b_957_, v_ops_958_);
if (lean_obj_tag(v___x_961_) == 0)
{
lean_object* v_a_962_; lean_object* v___x_964_; uint8_t v_isShared_965_; uint8_t v_isSharedCheck_980_; 
v_a_962_ = lean_ctor_get(v___x_961_, 0);
v_isSharedCheck_980_ = !lean_is_exclusive(v___x_961_);
if (v_isSharedCheck_980_ == 0)
{
v___x_964_ = v___x_961_;
v_isShared_965_ = v_isSharedCheck_980_;
goto v_resetjp_963_;
}
else
{
lean_inc(v_a_962_);
lean_dec(v___x_961_);
v___x_964_ = lean_box(0);
v_isShared_965_ = v_isSharedCheck_980_;
goto v_resetjp_963_;
}
v_resetjp_963_:
{
if (lean_obj_tag(v_a_962_) == 0)
{
lean_object* v___x_966_; lean_object* v___x_968_; 
lean_dec_ref(v_valid_959_);
v___x_966_ = lean_box(0);
if (v_isShared_965_ == 0)
{
lean_ctor_set(v___x_964_, 0, v___x_966_);
v___x_968_ = v___x_964_;
goto v_reusejp_967_;
}
else
{
lean_object* v_reuseFailAlloc_969_; 
v_reuseFailAlloc_969_ = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(v_reuseFailAlloc_969_, 0, v___x_966_);
v___x_968_ = v_reuseFailAlloc_969_;
goto v_reusejp_967_;
}
v_reusejp_967_:
{
return v___x_968_;
}
}
else
{
lean_object* v_val_970_; lean_object* v___x_971_; lean_object* v___y_973_; lean_object* v___x_976_; uint8_t v___x_977_; 
lean_del_object(v___x_964_);
v_val_970_ = lean_ctor_get(v_a_962_, 0);
lean_inc(v_val_970_);
lean_dec_ref_known(v_a_962_, 1);
v___x_971_ = ((lean_object*)(lp_puzzle_Puzzle_runChecked___closed__0));
v___x_976_ = lean_apply_1(v_valid_959_, v_val_970_);
v___x_977_ = lean_unbox(v___x_976_);
if (v___x_977_ == 0)
{
lean_object* v___x_978_; 
v___x_978_ = ((lean_object*)(lp_puzzle_Puzzle_runChecked___closed__1));
v___y_973_ = v___x_978_;
goto v___jp_972_;
}
else
{
lean_object* v___x_979_; 
v___x_979_ = ((lean_object*)(lp_puzzle_Puzzle_runChecked___closed__2));
v___y_973_ = v___x_979_;
goto v___jp_972_;
}
v___jp_972_:
{
lean_object* v___x_974_; lean_object* v___x_975_; 
v___x_974_ = lean_string_append(v___x_971_, v___y_973_);
v___x_975_ = lp_puzzle_IO_println___at___00Puzzle_runAll_spec__1(v___x_974_);
return v___x_975_;
}
}
}
}
else
{
lean_object* v_a_981_; lean_object* v___x_983_; uint8_t v_isShared_984_; uint8_t v_isSharedCheck_988_; 
lean_dec_ref(v_valid_959_);
v_a_981_ = lean_ctor_get(v___x_961_, 0);
v_isSharedCheck_988_ = !lean_is_exclusive(v___x_961_);
if (v_isSharedCheck_988_ == 0)
{
v___x_983_ = v___x_961_;
v_isShared_984_ = v_isSharedCheck_988_;
goto v_resetjp_982_;
}
else
{
lean_inc(v_a_981_);
lean_dec(v___x_961_);
v___x_983_ = lean_box(0);
v_isShared_984_ = v_isSharedCheck_988_;
goto v_resetjp_982_;
}
v_resetjp_982_:
{
lean_object* v___x_986_; 
if (v_isShared_984_ == 0)
{
v___x_986_ = v___x_983_;
goto v_reusejp_985_;
}
else
{
lean_object* v_reuseFailAlloc_987_; 
v_reuseFailAlloc_987_ = lean_alloc_ctor(1, 1, 0);
lean_ctor_set(v_reuseFailAlloc_987_, 0, v_a_981_);
v___x_986_ = v_reuseFailAlloc_987_;
goto v_reusejp_985_;
}
v_reusejp_985_:
{
return v___x_986_;
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_runChecked___boxed(lean_object* v_locked_989_, lean_object* v_b_990_, lean_object* v_ops_991_, lean_object* v_valid_992_, lean_object* v_a_993_){
_start:
{
lean_object* v_res_994_; 
v_res_994_ = lp_puzzle_Puzzle_runChecked(v_locked_989_, v_b_990_, v_ops_991_, v_valid_992_);
lean_dec(v_ops_991_);
lean_dec(v_locked_989_);
return v_res_994_;
}
}
LEAN_EXPORT lean_object* lp_puzzle___private_Init_Data_Array_Basic_0__Array_foldrMUnsafe_fold___at___00List_foldrTR___at___00Puzzle_allCells_spec__0_spec__0(lean_object* v_as_995_, size_t v_i_996_, size_t v_stop_997_, lean_object* v_b_998_){
_start:
{
uint8_t v___x_999_; 
v___x_999_ = lean_usize_dec_eq(v_i_996_, v_stop_997_);
if (v___x_999_ == 0)
{
size_t v___x_1000_; size_t v___x_1001_; lean_object* v___x_1002_; lean_object* v___x_1003_; 
v___x_1000_ = ((size_t)1ULL);
v___x_1001_ = lean_usize_sub(v_i_996_, v___x_1000_);
v___x_1002_ = lean_array_uget_borrowed(v_as_995_, v___x_1001_);
lean_inc(v___x_1002_);
v___x_1003_ = l_List_appendTR___redArg(v___x_1002_, v_b_998_);
v_i_996_ = v___x_1001_;
v_b_998_ = v___x_1003_;
goto _start;
}
else
{
return v_b_998_;
}
}
}
LEAN_EXPORT lean_object* lp_puzzle___private_Init_Data_Array_Basic_0__Array_foldrMUnsafe_fold___at___00List_foldrTR___at___00Puzzle_allCells_spec__0_spec__0___boxed(lean_object* v_as_1005_, lean_object* v_i_1006_, lean_object* v_stop_1007_, lean_object* v_b_1008_){
_start:
{
size_t v_i_boxed_1009_; size_t v_stop_boxed_1010_; lean_object* v_res_1011_; 
v_i_boxed_1009_ = lean_unbox_usize(v_i_1006_);
lean_dec(v_i_1006_);
v_stop_boxed_1010_ = lean_unbox_usize(v_stop_1007_);
lean_dec(v_stop_1007_);
v_res_1011_ = lp_puzzle___private_Init_Data_Array_Basic_0__Array_foldrMUnsafe_fold___at___00List_foldrTR___at___00Puzzle_allCells_spec__0_spec__0(v_as_1005_, v_i_boxed_1009_, v_stop_boxed_1010_, v_b_1008_);
lean_dec_ref(v_as_1005_);
return v_res_1011_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_foldrTR___at___00Puzzle_allCells_spec__0(lean_object* v_init_1012_, lean_object* v_l_1013_){
_start:
{
lean_object* v___x_1014_; lean_object* v___x_1015_; lean_object* v___x_1016_; uint8_t v___x_1017_; 
v___x_1014_ = lean_array_mk(v_l_1013_);
v___x_1015_ = lean_array_get_size(v___x_1014_);
v___x_1016_ = lean_unsigned_to_nat(0u);
v___x_1017_ = lean_nat_dec_lt(v___x_1016_, v___x_1015_);
if (v___x_1017_ == 0)
{
lean_dec_ref(v___x_1014_);
return v_init_1012_;
}
else
{
size_t v___x_1018_; size_t v___x_1019_; lean_object* v___x_1020_; 
v___x_1018_ = lean_usize_of_nat(v___x_1015_);
v___x_1019_ = ((size_t)0ULL);
v___x_1020_ = lp_puzzle___private_Init_Data_Array_Basic_0__Array_foldrMUnsafe_fold___at___00List_foldrTR___at___00Puzzle_allCells_spec__0_spec__0(v___x_1014_, v___x_1018_, v___x_1019_, v_init_1012_);
lean_dec_ref(v___x_1014_);
return v___x_1020_;
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_allCells(lean_object* v_b_1021_){
_start:
{
lean_object* v___x_1022_; lean_object* v___x_1023_; 
v___x_1022_ = lean_box(0);
v___x_1023_ = lp_puzzle_List_foldrTR___at___00Puzzle_allCells_spec__0(v___x_1022_, v_b_1021_);
return v___x_1023_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_countP_go___at___00Puzzle_countColor_spec__0(uint8_t v_c_1024_, lean_object* v_a_1025_, lean_object* v_a_1026_){
_start:
{
if (lean_obj_tag(v_a_1025_) == 0)
{
return v_a_1026_;
}
else
{
lean_object* v_head_1027_; lean_object* v_tail_1028_; uint8_t v_color_1029_; lean_object* v___x_1030_; lean_object* v___x_1031_; uint8_t v___x_1032_; 
v_head_1027_ = lean_ctor_get(v_a_1025_, 0);
v_tail_1028_ = lean_ctor_get(v_a_1025_, 1);
v_color_1029_ = lean_ctor_get_uint8(v_head_1027_, sizeof(void*)*1);
v___x_1030_ = lp_puzzle_Puzzle_Color_ctorIdx(v_color_1029_);
v___x_1031_ = lp_puzzle_Puzzle_Color_ctorIdx(v_c_1024_);
v___x_1032_ = lean_nat_dec_eq(v___x_1030_, v___x_1031_);
lean_dec(v___x_1031_);
lean_dec(v___x_1030_);
if (v___x_1032_ == 0)
{
v_a_1025_ = v_tail_1028_;
goto _start;
}
else
{
lean_object* v___x_1034_; lean_object* v___x_1035_; 
v___x_1034_ = lean_unsigned_to_nat(1u);
v___x_1035_ = lean_nat_add(v_a_1026_, v___x_1034_);
lean_dec(v_a_1026_);
v_a_1025_ = v_tail_1028_;
v_a_1026_ = v___x_1035_;
goto _start;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_countP_go___at___00Puzzle_countColor_spec__0___boxed(lean_object* v_c_1037_, lean_object* v_a_1038_, lean_object* v_a_1039_){
_start:
{
uint8_t v_c_boxed_1040_; lean_object* v_res_1041_; 
v_c_boxed_1040_ = lean_unbox(v_c_1037_);
v_res_1041_ = lp_puzzle_List_countP_go___at___00Puzzle_countColor_spec__0(v_c_boxed_1040_, v_a_1038_, v_a_1039_);
lean_dec(v_a_1038_);
return v_res_1041_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_countColor(lean_object* v_b_1042_, uint8_t v_c_1043_){
_start:
{
lean_object* v___x_1044_; lean_object* v___x_1045_; lean_object* v___x_1046_; 
v___x_1044_ = lp_puzzle_Puzzle_allCells(v_b_1042_);
v___x_1045_ = lean_unsigned_to_nat(0u);
v___x_1046_ = lp_puzzle_List_countP_go___at___00Puzzle_countColor_spec__0(v_c_1043_, v___x_1044_, v___x_1045_);
lean_dec(v___x_1044_);
return v___x_1046_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_countColor___boxed(lean_object* v_b_1047_, lean_object* v_c_1048_){
_start:
{
uint8_t v_c_boxed_1049_; lean_object* v_res_1050_; 
v_c_boxed_1049_ = lean_unbox(v_c_1048_);
v_res_1050_ = lp_puzzle_Puzzle_countColor(v_b_1047_, v_c_boxed_1049_);
return v_res_1050_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0___lam__0(lean_object* v_b_1051_, uint8_t v_c_1052_, lean_object* v_x_1053_, lean_object* v_y_1054_){
_start:
{
lean_object* v___x_1055_; uint8_t v___x_1056_; 
lean_inc(v_y_1054_);
lean_inc(v_x_1053_);
v___x_1055_ = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(v___x_1055_, 0, v_x_1053_);
lean_ctor_set(v___x_1055_, 1, v_y_1054_);
v___x_1056_ = lp_puzzle_Puzzle_inside(v_b_1051_, v___x_1055_);
lean_dec_ref_known(v___x_1055_, 2);
if (v___x_1056_ == 0)
{
lean_dec(v_y_1054_);
lean_dec(v_x_1053_);
return v___x_1056_;
}
else
{
lean_object* v___x_1057_; uint8_t v_color_1058_; lean_object* v___x_1059_; lean_object* v___x_1060_; uint8_t v___x_1061_; 
v___x_1057_ = lp_puzzle_Puzzle_getCell(v_b_1051_, v_x_1053_, v_y_1054_);
v_color_1058_ = lean_ctor_get_uint8(v___x_1057_, sizeof(void*)*1);
lean_dec_ref(v___x_1057_);
v___x_1059_ = lp_puzzle_Puzzle_Color_ctorIdx(v_color_1058_);
v___x_1060_ = lp_puzzle_Puzzle_Color_ctorIdx(v_c_1052_);
v___x_1061_ = lean_nat_dec_eq(v___x_1059_, v___x_1060_);
lean_dec(v___x_1060_);
lean_dec(v___x_1059_);
return v___x_1061_;
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0___lam__0___boxed(lean_object* v_b_1062_, lean_object* v_c_1063_, lean_object* v_x_1064_, lean_object* v_y_1065_){
_start:
{
uint8_t v_c_boxed_1066_; uint8_t v_res_1067_; lean_object* v_r_1068_; 
v_c_boxed_1066_ = lean_unbox(v_c_1063_);
v_res_1067_ = lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0___lam__0(v_b_1062_, v_c_boxed_1066_, v_x_1064_, v_y_1065_);
lean_dec(v_b_1062_);
v_r_1068_ = lean_box(v_res_1067_);
return v_r_1068_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0(lean_object* v_b_1069_, uint8_t v_c_1070_, lean_object* v_y_1071_, lean_object* v_x_1072_){
_start:
{
if (lean_obj_tag(v_x_1072_) == 0)
{
uint8_t v___x_1073_; 
lean_dec(v_y_1071_);
v___x_1073_ = 1;
return v___x_1073_;
}
else
{
lean_object* v_head_1074_; lean_object* v_tail_1075_; uint8_t v___x_1076_; 
v_head_1074_ = lean_ctor_get(v_x_1072_, 0);
lean_inc_n(v_head_1074_, 2);
v_tail_1075_ = lean_ctor_get(v_x_1072_, 1);
lean_inc(v_tail_1075_);
lean_dec_ref_known(v_x_1072_, 2);
lean_inc(v_y_1071_);
v___x_1076_ = lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0___lam__0(v_b_1069_, v_c_1070_, v_head_1074_, v_y_1071_);
if (v___x_1076_ == 0)
{
lean_dec(v_head_1074_);
v_x_1072_ = v_tail_1075_;
goto _start;
}
else
{
lean_object* v___x_1078_; lean_object* v___x_1079_; uint8_t v___x_1080_; 
v___x_1078_ = lean_unsigned_to_nat(1u);
v___x_1079_ = lean_nat_add(v_head_1074_, v___x_1078_);
lean_inc(v_y_1071_);
v___x_1080_ = lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0___lam__0(v_b_1069_, v_c_1070_, v___x_1079_, v_y_1071_);
if (v___x_1080_ == 0)
{
lean_object* v___x_1081_; uint8_t v___x_1082_; 
v___x_1081_ = lean_nat_add(v_y_1071_, v___x_1078_);
v___x_1082_ = lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0___lam__0(v_b_1069_, v_c_1070_, v_head_1074_, v___x_1081_);
if (v___x_1082_ == 0)
{
v_x_1072_ = v_tail_1075_;
goto _start;
}
else
{
lean_dec(v_tail_1075_);
lean_dec(v_y_1071_);
return v___x_1080_;
}
}
else
{
uint8_t v___x_1084_; 
lean_dec(v_tail_1075_);
lean_dec(v_head_1074_);
lean_dec(v_y_1071_);
v___x_1084_ = 0;
return v___x_1084_;
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0___boxed(lean_object* v_b_1085_, lean_object* v_c_1086_, lean_object* v_y_1087_, lean_object* v_x_1088_){
_start:
{
uint8_t v_c_boxed_1089_; uint8_t v_res_1090_; lean_object* v_r_1091_; 
v_c_boxed_1089_ = lean_unbox(v_c_1086_);
v_res_1090_ = lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0(v_b_1085_, v_c_boxed_1089_, v_y_1087_, v_x_1088_);
lean_dec(v_b_1085_);
v_r_1091_ = lean_box(v_res_1090_);
return v_r_1091_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__1(lean_object* v_b_1092_, uint8_t v_c_1093_, lean_object* v_x_1094_){
_start:
{
if (lean_obj_tag(v_x_1094_) == 0)
{
uint8_t v___x_1095_; 
v___x_1095_ = 1;
return v___x_1095_;
}
else
{
lean_object* v_head_1096_; lean_object* v_tail_1097_; lean_object* v___x_1098_; lean_object* v___x_1099_; uint8_t v___x_1100_; 
v_head_1096_ = lean_ctor_get(v_x_1094_, 0);
lean_inc(v_head_1096_);
v_tail_1097_ = lean_ctor_get(v_x_1094_, 1);
lean_inc(v_tail_1097_);
lean_dec_ref_known(v_x_1094_, 2);
v___x_1098_ = lp_puzzle_Puzzle_width(v_b_1092_);
v___x_1099_ = l_List_range(v___x_1098_);
v___x_1100_ = lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__0(v_b_1092_, v_c_1093_, v_head_1096_, v___x_1099_);
if (v___x_1100_ == 0)
{
lean_dec(v_tail_1097_);
return v___x_1100_;
}
else
{
v_x_1094_ = v_tail_1097_;
goto _start;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__1___boxed(lean_object* v_b_1102_, lean_object* v_c_1103_, lean_object* v_x_1104_){
_start:
{
uint8_t v_c_boxed_1105_; uint8_t v_res_1106_; lean_object* v_r_1107_; 
v_c_boxed_1105_ = lean_unbox(v_c_1103_);
v_res_1106_ = lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__1(v_b_1102_, v_c_boxed_1105_, v_x_1104_);
lean_dec(v_b_1102_);
v_r_1107_ = lean_box(v_res_1106_);
return v_r_1107_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_noAdjacent(lean_object* v_b_1108_, uint8_t v_c_1109_){
_start:
{
lean_object* v___x_1110_; lean_object* v___x_1111_; uint8_t v___x_1112_; 
v___x_1110_ = l_List_lengthTR___redArg(v_b_1108_);
v___x_1111_ = l_List_range(v___x_1110_);
v___x_1112_ = lp_puzzle_List_all___at___00Puzzle_noAdjacent_spec__1(v_b_1108_, v_c_1109_, v___x_1111_);
return v___x_1112_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_noAdjacent___boxed(lean_object* v_b_1113_, lean_object* v_c_1114_){
_start:
{
uint8_t v_c_boxed_1115_; uint8_t v_res_1116_; lean_object* v_r_1117_; 
v_c_boxed_1115_ = lean_unbox(v_c_1114_);
v_res_1116_ = lp_puzzle_Puzzle_noAdjacent(v_b_1113_, v_c_boxed_1115_);
lean_dec(v_b_1113_);
v_r_1117_ = lean_box(v_res_1116_);
return v_r_1117_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__0(lean_object* v_row_1118_, lean_object* v_x_1119_){
_start:
{
if (lean_obj_tag(v_x_1119_) == 0)
{
uint8_t v___x_1120_; 
v___x_1120_ = 1;
return v___x_1120_;
}
else
{
lean_object* v_head_1121_; lean_object* v_tail_1122_; uint8_t v_color_1123_; lean_object* v___y_1125_; 
v_head_1121_ = lean_ctor_get(v_x_1119_, 0);
v_tail_1122_ = lean_ctor_get(v_x_1119_, 1);
v_color_1123_ = lean_ctor_get_uint8(v_head_1121_, sizeof(void*)*1);
if (lean_obj_tag(v_row_1118_) == 0)
{
lean_object* v___x_1131_; 
v___x_1131_ = ((lean_object*)(lp_puzzle_Puzzle_blank));
v___y_1125_ = v___x_1131_;
goto v___jp_1124_;
}
else
{
lean_object* v_head_1132_; 
v_head_1132_ = lean_ctor_get(v_row_1118_, 0);
v___y_1125_ = v_head_1132_;
goto v___jp_1124_;
}
v___jp_1124_:
{
uint8_t v_color_1126_; lean_object* v___x_1127_; lean_object* v___x_1128_; uint8_t v___x_1129_; 
v_color_1126_ = lean_ctor_get_uint8(v___y_1125_, sizeof(void*)*1);
v___x_1127_ = lp_puzzle_Puzzle_Color_ctorIdx(v_color_1123_);
v___x_1128_ = lp_puzzle_Puzzle_Color_ctorIdx(v_color_1126_);
v___x_1129_ = lean_nat_dec_eq(v___x_1127_, v___x_1128_);
lean_dec(v___x_1128_);
lean_dec(v___x_1127_);
if (v___x_1129_ == 0)
{
return v___x_1129_;
}
else
{
v_x_1119_ = v_tail_1122_;
goto _start;
}
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__0___boxed(lean_object* v_row_1133_, lean_object* v_x_1134_){
_start:
{
uint8_t v_res_1135_; lean_object* v_r_1136_; 
v_res_1135_ = lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__0(v_row_1133_, v_x_1134_);
lean_dec(v_x_1134_);
lean_dec(v_row_1133_);
v_r_1136_ = lean_box(v_res_1135_);
return v_r_1136_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__1(lean_object* v_x_1137_){
_start:
{
if (lean_obj_tag(v_x_1137_) == 0)
{
uint8_t v___x_1138_; 
v___x_1138_ = 1;
return v___x_1138_;
}
else
{
lean_object* v_head_1139_; lean_object* v_tail_1140_; uint8_t v___x_1141_; 
v_head_1139_ = lean_ctor_get(v_x_1137_, 0);
v_tail_1140_ = lean_ctor_get(v_x_1137_, 1);
v___x_1141_ = lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__0(v_head_1139_, v_head_1139_);
if (v___x_1141_ == 0)
{
return v___x_1141_;
}
else
{
v_x_1137_ = v_tail_1140_;
goto _start;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__1___boxed(lean_object* v_x_1143_){
_start:
{
uint8_t v_res_1144_; lean_object* v_r_1145_; 
v_res_1144_ = lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__1(v_x_1143_);
lean_dec(v_x_1143_);
v_r_1145_ = lean_box(v_res_1144_);
return v_r_1145_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_rowsUniform(lean_object* v_b_1146_){
_start:
{
uint8_t v___x_1147_; 
v___x_1147_ = lp_puzzle_List_all___at___00Puzzle_rowsUniform_spec__1(v_b_1146_);
return v___x_1147_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_rowsUniform___boxed(lean_object* v_b_1148_){
_start:
{
uint8_t v_res_1149_; lean_object* v_r_1150_; 
v_res_1149_ = lp_puzzle_Puzzle_rowsUniform(v_b_1148_);
lean_dec(v_b_1148_);
v_r_1150_ = lean_box(v_res_1149_);
return v_r_1150_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__0(lean_object* v_row_1151_, lean_object* v___x_1152_, lean_object* v_x_1153_){
_start:
{
if (lean_obj_tag(v_x_1153_) == 0)
{
uint8_t v___x_1154_; 
v___x_1154_ = 1;
return v___x_1154_;
}
else
{
lean_object* v_head_1155_; lean_object* v_tail_1156_; lean_object* v___x_1157_; lean_object* v___x_1158_; uint8_t v_color_1159_; lean_object* v___x_1160_; lean_object* v___x_1161_; lean_object* v___x_1162_; lean_object* v___x_1163_; uint8_t v_color_1164_; lean_object* v___x_1165_; lean_object* v___x_1166_; uint8_t v___x_1167_; 
v_head_1155_ = lean_ctor_get(v_x_1153_, 0);
lean_inc_n(v_head_1155_, 2);
v_tail_1156_ = lean_ctor_get(v_x_1153_, 1);
lean_inc(v_tail_1156_);
lean_dec_ref_known(v_x_1153_, 2);
v___x_1157_ = ((lean_object*)(lp_puzzle_Puzzle_blank));
v___x_1158_ = l_List_getD___redArg(v_row_1151_, v_head_1155_, v___x_1157_);
v_color_1159_ = lean_ctor_get_uint8(v___x_1158_, sizeof(void*)*1);
lean_dec(v___x_1158_);
v___x_1160_ = lean_unsigned_to_nat(1u);
v___x_1161_ = lean_nat_sub(v___x_1152_, v___x_1160_);
v___x_1162_ = lean_nat_sub(v___x_1161_, v_head_1155_);
lean_dec(v_head_1155_);
lean_dec(v___x_1161_);
v___x_1163_ = l_List_getD___redArg(v_row_1151_, v___x_1162_, v___x_1157_);
v_color_1164_ = lean_ctor_get_uint8(v___x_1163_, sizeof(void*)*1);
lean_dec(v___x_1163_);
v___x_1165_ = lp_puzzle_Puzzle_Color_ctorIdx(v_color_1159_);
v___x_1166_ = lp_puzzle_Puzzle_Color_ctorIdx(v_color_1164_);
v___x_1167_ = lean_nat_dec_eq(v___x_1165_, v___x_1166_);
lean_dec(v___x_1166_);
lean_dec(v___x_1165_);
if (v___x_1167_ == 0)
{
lean_dec(v_tail_1156_);
return v___x_1167_;
}
else
{
v_x_1153_ = v_tail_1156_;
goto _start;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__0___boxed(lean_object* v_row_1169_, lean_object* v___x_1170_, lean_object* v_x_1171_){
_start:
{
uint8_t v_res_1172_; lean_object* v_r_1173_; 
v_res_1172_ = lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__0(v_row_1169_, v___x_1170_, v_x_1171_);
lean_dec(v___x_1170_);
lean_dec(v_row_1169_);
v_r_1173_ = lean_box(v_res_1172_);
return v_r_1173_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__1(lean_object* v_x_1174_){
_start:
{
if (lean_obj_tag(v_x_1174_) == 0)
{
uint8_t v___x_1175_; 
v___x_1175_ = 1;
return v___x_1175_;
}
else
{
lean_object* v_head_1176_; lean_object* v_tail_1177_; lean_object* v___x_1178_; lean_object* v___x_1179_; uint8_t v___x_1180_; 
v_head_1176_ = lean_ctor_get(v_x_1174_, 0);
v_tail_1177_ = lean_ctor_get(v_x_1174_, 1);
v___x_1178_ = l_List_lengthTR___redArg(v_head_1176_);
lean_inc(v___x_1178_);
v___x_1179_ = l_List_range(v___x_1178_);
v___x_1180_ = lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__0(v_head_1176_, v___x_1178_, v___x_1179_);
lean_dec(v___x_1178_);
if (v___x_1180_ == 0)
{
return v___x_1180_;
}
else
{
v_x_1174_ = v_tail_1177_;
goto _start;
}
}
}
}
LEAN_EXPORT lean_object* lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__1___boxed(lean_object* v_x_1182_){
_start:
{
uint8_t v_res_1183_; lean_object* v_r_1184_; 
v_res_1183_ = lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__1(v_x_1182_);
lean_dec(v_x_1182_);
v_r_1184_ = lean_box(v_res_1183_);
return v_r_1184_;
}
}
LEAN_EXPORT uint8_t lp_puzzle_Puzzle_symmetricH(lean_object* v_b_1185_){
_start:
{
uint8_t v___x_1186_; 
v___x_1186_ = lp_puzzle_List_all___at___00Puzzle_symmetricH_spec__1(v_b_1185_);
return v___x_1186_;
}
}
LEAN_EXPORT lean_object* lp_puzzle_Puzzle_symmetricH___boxed(lean_object* v_b_1187_){
_start:
{
uint8_t v_res_1188_; lean_object* v_r_1189_; 
v_res_1188_ = lp_puzzle_Puzzle_symmetricH(v_b_1187_);
lean_dec(v_b_1187_);
v_r_1189_ = lean_box(v_res_1188_);
return v_r_1189_;
}
}
lean_object* initialize_Init(uint8_t builtin);
lean_object* initialize_Init(uint8_t builtin);
void lean_initialize_runtime_module();
static bool _G_initialized = false;
LEAN_EXPORT lean_object* initialize_puzzle_Puzzle(uint8_t builtin) {
lean_object * res;
if (_G_initialized) return lean_io_result_mk_ok(lean_box(0));
_G_initialized = true;
lean_initialize_runtime_module();
res = initialize_Init(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_Init(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
return lean_io_result_mk_ok(lean_box(0));
}
#ifdef __cplusplus
}
#endif
